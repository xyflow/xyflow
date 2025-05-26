import type { Ref } from 'vue';
import type {
  Edge,
  EdgeLookup,
  FlowProps,
  InternalNode,
  Node,
  NodeLookup,
  VueFlowInstance,
  VueFlowState,
  VueFlowStoreHandle,
} from '../types';
import { reactive, shallowRef, toRaw, watch } from 'vue';
import { useActions } from './actions';
import { useGetters } from './getters';
import { useState } from './state';

/**
 * External backing refs for a store's nodes/edges. When `<VueFlow>` passes its `v-model` refs here, the
 * store reads/writes them directly (single source of truth, like svelte's `$bindable` proxy) so a
 * separate v-model sync layer isn't needed. Omitted → the store uses internal refs.
 */
export interface StoreSignals<NodeType extends Node = Node, EdgeType extends Edge = Edge> {
  nodes?: Ref<NodeType[]>;
  edges?: Ref<EdgeType[]>;
}

/**
 * Builds a fully-wired VueFlow store instance (reactive state, lookups, getters, actions, hooks).
 *
 * Standalone factory so store ownership lives in the component that creates it — `<VueFlow>` or
 * `<VueFlowProvider>` via `useCreateVueFlow` — which `provide`s it to descendants. There is no global
 * registry; `useVueFlow()` resolves the store purely through `inject`.
 *
 * @internal
 */
export function createVueFlowStore<NodeType extends Node = Node, EdgeType extends Edge = Edge>(
  id: string,
  preloadedState?: FlowProps<NodeType, EdgeType>,
  onDestroy?: (id: string) => void,
  signals?: StoreSignals<NodeType, EdgeType>,
): VueFlowStoreHandle<NodeType, EdgeType> {
  // nodes/edges are backed by (optionally injected) signal refs — the single source of truth. When
  // `<VueFlow>` passes its v-model refs, mutating the store *is* the v-model update (svelte's
  // bindable-prop proxy), so no separate sync layer is needed. Default: internal `shallowRef`s — the
  // arrays are only ever reassigned whole (immutable commits), and `shallowRef` keeps the fallback's
  // type at `Ref<NodeType[]>` exactly (a deep `ref` would unwrap to `Ref<UnwrapRefSimple<NodeType>[]>`,
  // which TS can't reconcile with the injected signal's type over an unresolved generic). The explicit
  // `| undefined` reflects an injected-but-unbound `defineModel` ref.
  const nodesSignal: Ref<NodeType[] | undefined> = signals?.nodes ?? shallowRef([]);
  const edgesSignal: Ref<EdgeType[] | undefined> = signals?.edges ?? shallowRef([]);

  // The array references the store itself last wrote (through the `state.nodes`/`.edges` setters below).
  // The single-source binding watch (further down) uses these to tell its own writes apart from an
  // external `v-model` reassignment — no pause/resume flags needed.
  let lastWriteNodes: NodeType[] | undefined;
  let lastWriteEdges: EdgeType[] | undefined;

  // Stable empty fallbacks: an injected `v-model` ref is `undefined` until bound (e.g. `<VueFlow>` with no
  // `:nodes`), so reads must never surface `undefined` (everything iterates `state.nodes`/`.edges`). A
  // stable reference avoids reactivity churn while unbound; `setState`/`commit` replace it with a real array.
  const emptyNodes: NodeType[] = [];
  const emptyEdges: EdgeType[] = [];

  const state = useState<NodeType, EdgeType>();

  // Proxy `state.nodes`/`.edges` through the signals via accessors (svelte's `get nodes()` pattern), so
  // every existing `state.nodes` read/write stays unchanged while the backing becomes injectable.
  Object.defineProperty(state, 'nodes', {
    get: () => nodesSignal.value ?? emptyNodes,
    set: (value: NodeType[]) => {
      lastWriteNodes = toRaw(value);
      nodesSignal.value = value;
    },
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(state, 'edges', {
    get: () => edgesSignal.value ?? emptyEdges,
    set: (value: EdgeType[]) => {
      lastWriteEdges = toRaw(value);
      edgesSignal.value = value;
    },
    enumerable: true,
    configurable: true,
  });

  const reactiveState = reactive(state) as any;

  const hooksOn = <any>{};
  for (const [n, h] of Object.entries(reactiveState.hooks)) {
    const name = `on${n.charAt(0).toUpperCase() + n.slice(1)}`;
    hooksOn[name] = (h as any).on;
  }

  const emits = <any>{};
  for (const [n, h] of Object.entries(reactiveState.hooks)) {
    emits[n] = (h as any).trigger;
  }

  // The lookup maps hold the enriched `InternalNode`s/edges (canonical for `internals`/`measured`); the
  // canonical user-facing `Node`/`Edge` arrays live in `state.nodes`/`state.edges` (the v-model source of
  // truth). They are created as plain `Map`s in `useState` and made reactive by `reactive(state)` above, so
  // Map identity is stable across mutations (`@xyflow/system` helpers `.set` clones in place while reads via
  // `.get` stay reactive) AND `useStore()` surfaces them as part of the state. The store actions write both
  // in one imperative pass (`commitNodes` re-adopts the user nodes into the lookup, `commitEdges` mirrors
  // edges) — no derivation watcher, no rebuild thrash.
  //
  // The `as` casts undo `reactive()`'s `UnwrapNestedRefs` widening over a Map of the *generic*
  // `InternalNode<NodeType>` (TS can't prove the element type has no refs to unwrap); at runtime the proxy is
  // exactly a `Map<string, InternalNode>`, so the assertion is sound (documented Vue + generics friction).
  const nodeLookup = reactiveState.nodeLookup as NodeLookup<NodeType>;
  const parentLookup = reactiveState.parentLookup as Map<string, Map<string, InternalNode<NodeType>>>;
  const edgeLookup = reactiveState.edgeLookup as EdgeLookup<EdgeType>;

  const getters = useGetters<NodeType, EdgeType>(reactiveState, nodeLookup);

  const actions = useActions<NodeType, EdgeType>(reactiveState, nodeLookup, parentLookup, edgeLookup);

  actions.setState({ ...reactiveState, ...preloadedState } as any);

  // Single-source `v-model` binding. When `<VueFlow>` passes its model refs as signals, the store's
  // nodes/edges ARE those refs: internal mutations (drag, `addEdges`, `applyNodeChanges`, …) write them
  // through the `state.nodes`/`.edges` setters, which IS the v-model write-back — the OUT direction is
  // free, no watcher. The only thing left is adopting an EXTERNAL reassignment (`nodes.value = [...]` in
  // user land) so the lookups rebuild. The store's own writes are recorded in `lastWriteNodes`; a user
  // reassignment writes the signal directly, bypassing the setter, so we re-adopt only then (mirrors
  // svelte-flow re-running `adoptUserNodes` via `$derived` on a reference change — no pause/resume).
  // Identity must be compared on the RAW arrays: a parent binding the v-model to a deep `ref` hands our
  // own write back as its reactive proxy, which would fail a plain `!==` and loop `setNodes` forever.
  if (signals?.nodes) {
    watch(nodesSignal, (next) => {
      const nextRaw = next && toRaw(next);
      if (nextRaw && nextRaw !== lastWriteNodes) {
        actions.setNodes(nextRaw);
      }
    });
  }
  if (signals?.edges) {
    watch(edgesSignal, (next) => {
      const nextRaw = next && toRaw(next);
      if (nextRaw && nextRaw !== lastWriteEdges) {
        actions.setEdges(nextRaw as unknown as EdgeType[]);
      }
    });
  }

  // The curated instance (`useVueFlow()`): actions + getters + event hooks + identity. Raw reactive
  // state (`useStore()`) is `reactiveState` itself — the two views over one store.
  const instance: VueFlowInstance<NodeType, EdgeType> = {
    ...hooksOn,
    ...getters,
    ...actions,
    emits,
    id,
    vueFlowVersion: typeof __VUE_FLOW_VERSION__ !== 'undefined' ? __VUE_FLOW_VERSION__ : 'UNKNOWN',
    $destroy: () => {
      onDestroy?.(id);
    },
  };

  return { instance, state: reactiveState as VueFlowState<NodeType, EdgeType> };
}

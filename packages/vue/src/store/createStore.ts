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
import { reactive, shallowRef } from 'vue';
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
  // The canonical, synchronous source of truth for nodes/edges is ALWAYS an internal `shallowRef` — never
  // the v-model/`defineModel` ref. `defineModel`'s ref round-trips: its `.value` doesn't reflect a write
  // until the parent prop syncs back, so reading through it makes `state.nodes`/`getNodes` stale on the
  // same tick (and inconsistent between the owned- and reused-store paths). Keeping the truth internal
  // means every read (`state.nodes`, `getNodes`, the lookups) is current immediately. `<VueFlow>`'s
  // v-model ref is a separate projection, bridged (out+in, synchronously) by `useWatchProps` so it mirrors
  // this ref without lag. `signals` only SEEDS the initial value here — it is never the backing store.
  const nodesSignal = shallowRef<NodeType[]>((signals?.nodes?.value as NodeType[] | undefined) ?? []);
  const edgesSignal = shallowRef<EdgeType[]>((signals?.edges?.value as EdgeType[] | undefined) ?? []);

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
      nodesSignal.value = value;
    },
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(state, 'edges', {
    get: () => edgesSignal.value ?? emptyEdges,
    set: (value: EdgeType[]) => {
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

  // The v-model bridge (adopting external `nodes.value = [...]` reassignments IN, and mirroring store
  // commits OUT to the model ref) lives entirely in `useWatchProps` now — for BOTH the owned- and
  // reused-store paths — so the canonical `nodesSignal`/`edgesSignal` above stay purely internal.

  // The curated instance (`useVueFlow()`): actions + getters + event hooks + identity. Raw reactive
  // state (`useStore()`) is `reactiveState` itself — the two views over one store.
  const instance: VueFlowInstance<NodeType, EdgeType> = {
    ...hooksOn,
    ...getters,
    ...actions,
    emits,
    id,
    $destroy: () => {
      onDestroy?.(id);
    },
  };

  return { instance, state: reactiveState as VueFlowState<NodeType, EdgeType> };
}

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
 * External backing refs that seed a store's nodes/edges. `<VueFlow>` passes its `v-model` refs here.
 * Omitted → the store uses internal refs.
 */
export interface StoreSignals<NodeType extends Node = Node, EdgeType extends Edge = Edge> {
  nodes?: Ref<NodeType[]>;
  edges?: Ref<EdgeType[]>;
}

/**
 * Builds a fully-wired VueFlow store instance (reactive state, lookups, getters, actions, hooks). The
 * creating component (`<VueFlow>`/`<VueFlowProvider>`) owns it and `provide`s it; `useVueFlow()` injects it.
 *
 * @internal
 */
export function createVueFlowStore<NodeType extends Node = Node, EdgeType extends Edge = Edge>(
  id: string,
  preloadedState?: FlowProps<NodeType, EdgeType>,
  onDestroy?: (id: string) => void,
  signals?: StoreSignals<NodeType, EdgeType>,
): VueFlowStoreHandle<NodeType, EdgeType> {
  // canonical source of truth is ALWAYS an internal shallowRef, never the v-model ref — defineModel's ref
  // round-trips (its `.value` lags a write), so reading through it would stale same-tick state.nodes/getNodes.
  // useWatchProps bridges the v-model ref out+in; `signals` only seeds the initial value here.
  const nodesSignal = shallowRef<NodeType[]>((signals?.nodes?.value as NodeType[] | undefined) ?? []);
  const edgesSignal = shallowRef<EdgeType[]>((signals?.edges?.value as EdgeType[] | undefined) ?? []);

  // stable empty fallbacks so reads never surface `undefined` while a v-model ref is still unbound; a stable
  // reference avoids reactivity churn until `setState`/`commit` replaces it with a real array.
  const emptyNodes: NodeType[] = [];
  const emptyEdges: EdgeType[] = [];

  const state = useState<NodeType, EdgeType>();

  // proxy `state.nodes`/`.edges` through the signals via accessors, so every existing read/write stays
  // unchanged while the backing ref becomes injectable.
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

  // lookups hold the enriched InternalNodes/edges; the user-facing Node/Edge arrays stay in state.nodes/edges.
  // They're reactive Maps with stable identity — actions write both in one imperative pass (commitNodes/
  // commitEdges), no derivation watcher. The `as` casts undo reactive()'s UnwrapNestedRefs widening over the
  // generic Map; at runtime the proxy is exactly a Map<string, InternalNode>, so the assertion is sound.
  const nodeLookup = reactiveState.nodeLookup as NodeLookup<NodeType>;
  const parentLookup = reactiveState.parentLookup as Map<string, Map<string, InternalNode<NodeType>>>;
  const edgeLookup = reactiveState.edgeLookup as EdgeLookup<EdgeType>;

  const getters = useGetters<NodeType, EdgeType>(reactiveState, nodeLookup);

  const actions = useActions<NodeType, EdgeType>(reactiveState, nodeLookup, parentLookup, edgeLookup);

  actions.setState({ ...reactiveState, ...preloadedState } as any);

  // the v-model bridge (external reassignments IN, store commits OUT) lives entirely in `useWatchProps`, so
  // the canonical `nodesSignal`/`edgesSignal` above stay purely internal.

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

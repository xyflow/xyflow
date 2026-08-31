import type { EdgeLookup, NodeLookup } from '@xyflow/system';
import type {
  Edge,
  InternalNode,
  Node,
  VueFlowInstance,
  VueFlowProps,
  VueFlowState,
  VueFlowStoreHandle,
} from '../types';
import { mergeAriaLabelConfig } from '@xyflow/system';
import { reactive, shallowRef } from 'vue';
import { defineControlled } from '../utils';
import { useActions } from './actions';
import { createCommit } from './commit';
import { useGetters } from './getters';
import { useState } from './state';

/**
 * Builds a fully-wired VueFlow store instance (reactive state, lookups, getters, actions, hooks). The
 * creating component (`<VueFlow>`/`<VueFlowProvider>`) owns it and `provide`s it; `useVueFlow()` injects it.
 *
 * @internal
 */
export function createVueFlowStore<NodeType extends Node = Node, EdgeType extends Edge = Edge>(
  id: string,
  initialState?: VueFlowProps<NodeType, EdgeType>,
): VueFlowStoreHandle<NodeType, EdgeType> {
  const state = useState<NodeType, EdgeType>();

  // nodes/edges stay SHALLOW-reactive (elements are markRaw'd, `data` can be huge)
  const nodesSignal = shallowRef<NodeType[]>(state.nodes);
  const edgesSignal = shallowRef<EdgeType[]>(state.edges);

  Object.defineProperty(state, 'nodes', {
    get: () => nodesSignal.value,
    set: (value: NodeType[]) => {
      nodesSignal.value = value;
    },
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(state, 'edges', {
    get: () => edgesSignal.value,
    set: (value: EdgeType[]) => {
      edgesSignal.value = value;
    },
    enumerable: true,
    configurable: true,
  });

  const reactiveState = reactive(state) as unknown as VueFlowState<NodeType, EdgeType>;

  const hooksOn = <any>{};
  for (const [n, h] of Object.entries(reactiveState.hooks)) {
    const name = `on${n.charAt(0).toUpperCase() + n.slice(1)}`;
    hooksOn[name] = h.on;
  }

  const emits = <any>{};
  for (const [n, h] of Object.entries(reactiveState.hooks)) {
    emits[n] = h.trigger;
  }

  const nodeLookup = reactiveState.nodeLookup as NodeLookup<InternalNode<NodeType>>;
  const parentLookup = reactiveState.parentLookup as Map<string, Map<string, InternalNode<NodeType>>>;
  const edgeLookup = reactiveState.edgeLookup as EdgeLookup<EdgeType>;

  const commit = createCommit<NodeType, EdgeType>(reactiveState, nodeLookup, parentLookup, edgeLookup);

  defineControlled(state, 'minZoom', v => state.panZoom?.setScaleExtent([v, state.maxZoom]));
  defineControlled(state, 'maxZoom', v => state.panZoom?.setScaleExtent([state.minZoom, v]));
  defineControlled(state, 'translateExtent', v => state.panZoom?.setTranslateExtent(v));
  defineControlled(state, 'paneClickDistance', v => state.panZoom?.setClickDistance(v));
  defineControlled(state, 'ariaLabelConfig', () => {}, mergeAriaLabelConfig);
  defineControlled(state, 'nodeExtent', () => commit.commitNodes(state.nodes, false));

  const getters = useGetters<NodeType, EdgeType>(reactiveState, nodeLookup);

  const actions = useActions<NodeType, EdgeType>(reactiveState, nodeLookup, edgeLookup, commit);

  // Apply the initial props. Controlled fields self-apply via their accessors; the node/edge arrays go
  // through their setters (setState no longer accepts them). Defaults already live in `state`.
  if (initialState) {
    const { nodes: initialNodes, edges: initialEdges, ...rest } = initialState;
    actions.setState(rest as VueFlowState<NodeType, EdgeType>);

    if (initialNodes !== undefined) {
      actions.setNodes(initialNodes);
    }

    if (initialEdges !== undefined) {
      actions.setEdges(initialEdges);
    }
  }

  const instance: VueFlowInstance<NodeType, EdgeType> = {
    ...hooksOn,
    ...getters,
    ...actions,
    emits,
    id,
  };

  return { instance, state: reactiveState as VueFlowState<NodeType, EdgeType> };
}

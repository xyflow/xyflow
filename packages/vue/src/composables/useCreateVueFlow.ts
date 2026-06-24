import type { StoreSignals } from '../store/createStore';
import type { Edge, EdgeChange, FlowOptions, Node, NodeChange, VueFlowInstance, VueFlowState, VueFlowStoreHandle } from '../types';
import { provide, useId, watch } from 'vue';
import { VueFlow, VueFlowStateKey } from '../context';
import { createVueFlowStore } from '../store/createStore';

/**
 * Create a VueFlow store, register the default change handlers, and `provide` it to descendants.
 *
 * Owned by `<VueFlow>` / `<VueFlowProvider>`. This is the *only* place a store is created and provided;
 * the public `useVueFlow()` (instance) and `useStore()` (state) are pure `inject` consumers. Must run in
 * a component `setup` (it calls `provide` + `watch` + `useId`, which bind to the component instance).
 *
 * @internal
 */
export function useCreateVueFlow<NodeType extends Node = Node, EdgeType extends Edge = Edge>(
  options?: FlowOptions<NodeType, EdgeType>,
  signals?: StoreSignals<NodeType, EdgeType>,
): VueFlowStoreHandle<NodeType, EdgeType> {
  // the flow id is only an aria/debug label (not a lookup key), so default it to Vue's SSR-safe `useId()`
  const handle = createVueFlowStore<NodeType, EdgeType>(options?.id ?? useId(), options, undefined, signals);
  const { instance, state } = handle;

  /**
   * Register default change handlers so `addNodes`/`addEdges`/etc. mutate the store. Disabling
   * `autoApplyChanges` (the user handles changes manually) removes them. Mirrors xyflow/react.
   */
  watch(
    () => state.autoApplyChanges,
    (shouldApplyDefault, _prev, onCleanup) => {
      const nodesChangeHandler = (changes: NodeChange[]) => {
        instance.applyNodeChanges(changes as NodeChange<NodeType>[]);
      };
      const edgesChangeHandler = (changes: EdgeChange[]) => {
        instance.applyEdgeChanges(changes as EdgeChange<EdgeType>[]);
      };

      if (shouldApplyDefault) {
        instance.onNodesChange(nodesChangeHandler);
        instance.onEdgesChange(edgesChangeHandler);
      }
      else {
        state.hooks.nodesChange.off(nodesChangeHandler);
        state.hooks.edgesChange.off(edgesChangeHandler);
      }

      onCleanup(() => {
        state.hooks.nodesChange.off(nodesChangeHandler);
        state.hooks.edgesChange.off(edgesChangeHandler);
      });
    },
    { immediate: true },
  );

  provide(VueFlow, instance as unknown as VueFlowInstance);
  provide(VueFlowStateKey, state as unknown as VueFlowState);

  return handle;
}

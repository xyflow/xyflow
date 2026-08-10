import type { Edge, Node, VueFlowInstance, VueFlowProps, VueFlowState, VueFlowStoreHandle } from '../types';
import { provide, useId } from 'vue';
import { VueFlow, VueFlowStateKey } from '../context';
import { createVueFlowStore } from '../store/createStore';

/**
 * Create a VueFlow store and `provide` it to descendants.
 *
 * Owned by `<VueFlow>` / `<VueFlowProvider>`. This is the *only* place a store is created and provided;
 * the public `useVueFlow()` (instance) and `useStore()` (state) are pure `inject` consumers. The default
 * change handlers (auto-apply) are registered by `<VueFlow>` from its binding — not here — so they follow
 * the consuming `<VueFlow>` even when it reuses a provider's store. Must run in a component `setup`.
 *
 * @internal
 */
export function useCreateVueFlow<NodeType extends Node = Node, EdgeType extends Edge = Edge>(
  options?: VueFlowProps<NodeType, EdgeType>,
): VueFlowStoreHandle<NodeType, EdgeType> {
  // the flow id is only an aria/debug label (not a lookup key), so default it to Vue's SSR-safe `useId()`
  const handle = createVueFlowStore<NodeType, EdgeType>(options?.id ?? useId(), options);

  provide(VueFlow, handle.instance as unknown as VueFlowInstance);
  provide(VueFlowStateKey, handle.state as unknown as VueFlowState);

  return handle;
}

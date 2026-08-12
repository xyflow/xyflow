import type { Edge, Node, VueFlowInstance, VueFlowProps } from '../types';
import { useCreateVueFlow } from './useCreateVueFlow';

/**
 * Create a VueFlow store, `provide` it to the current component's subtree, and return the instance — the
 * same API as {@link useVueFlow}. The Vue-native alternative to wrapping in `<VueFlowProvider>`: call it
 * in the component that renders `<VueFlow>` and you get the store's actions/getters/hooks in that same
 * `setup`, while the rendered `<VueFlow>` (and any `useVueFlow()`/`useStore()` below it) reuse the provided
 * store instead of creating their own.
 *
 * Must run in a component `setup` (it calls `provide`). Delegates to the same store factory as
 * `<VueFlowProvider>`, so one call scopes one store — host a single `<VueFlow>` per setup.
 *
 * @public
 * @param options - initial flow options (`id`, initial nodes/edges, defaults, …)
 * @returns the VueFlow instance (same shape `useVueFlow()` returns)
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { setupVueFlow, VueFlow } from '@xyflow/vue'
 *
 * const { addEdges, fitView } = setupVueFlow()
 * </script>
 *
 * <template>
 *   <VueFlow v-model:nodes="nodes" v-model:edges="edges" />
 * </template>
 * ```
 */
export function setupVueFlow<NodeType extends Node = Node, EdgeType extends Edge = Edge>(
  options?: VueFlowProps<NodeType, EdgeType>,
): VueFlowInstance<NodeType, EdgeType> {
  return useCreateVueFlow<NodeType, EdgeType>(options).instance;
}

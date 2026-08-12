import { computed } from 'vue';
import { areNodesInitialized } from '../utils';
import { useStore } from './useStore';

export interface UseNodesInitializedOptions {
  /**
   * Whether hidden nodes must also be measured before the flow counts as initialized. When `false`, hidden
   * nodes are ignored (the result can be `true` while some hidden nodes are still unmeasured).
   *
   * @default false
   */
  includeHiddenNodes?: boolean;
}

/**
 * Composable for getting the initialized state of all nodes.
 *
 * When a new node is added to the graph, it is not immediately initialized.
 * That's because the node's bounds are not yet known.
 * This composable will return false and then true when all nodes are initialized, i.e. when their bounds are known.
 *
 * @public
 * @param options - Options
 * @returns boolean indicating whether all nodes are initialized
 */
export function useNodesInitialized(options: UseNodesInitializedOptions = { includeHiddenNodes: false }) {
  const { nodeLookup } = useStore();

  return computed(() => areNodesInitialized(nodeLookup, options.includeHiddenNodes));
}

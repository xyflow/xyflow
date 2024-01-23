import { internalsSymbol } from '@xyflow/system';

import { useStore } from './useStore';
import type { ReactFlowState } from '../types';

export type UseNodesInitializedOptions = {
  includeHiddenNodes?: boolean;
};

const selector = (options: UseNodesInitializedOptions) => (s: ReactFlowState) => {
  if (s.nodes.length === 0) {
    return false;
  }

  for (const node of s.nodes) {
    if (options.includeHiddenNodes || !node.hidden) {
      if (node[internalsSymbol]?.handleBounds === undefined) {
        return false;
      }
    }
  }

  return true;
};

const defaultOptions = {
  includeHiddenNodes: false,
};

/**
 * Hook which returns true when all nodes are initialized.
 *
 * @public
 * @param options.includeHiddenNodes - defaults to false
 * @returns boolean indicating whether all nodes are initialized
 */
export function useNodesInitialized(options: UseNodesInitializedOptions = defaultOptions): boolean {
  const initialized = useStore(selector(options));

  return initialized;
}

import { useStore } from './useStore';
import type { SolidFlowState } from '../types';
import { nodeHasDimensions } from '@xyflow/system';

export type UseNodesInitializedOptions = {
  includeHiddenNodes?: boolean;
};

const selector = (options: UseNodesInitializedOptions) => (s: SolidFlowState) => {
  if (s.nodeLookup.size === 0) {
    return false;
  }

  for (const [, { hidden, internals }] of s.nodeLookup) {
    if (options.includeHiddenNodes || !hidden) {
      if (internals.handleBounds === undefined || !nodeHasDimensions(internals.userNode)) {
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

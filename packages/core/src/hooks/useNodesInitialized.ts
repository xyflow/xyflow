import { internalsSymbol } from '../utils';
import { useStore } from './useStore';
import type { ReactFlowState } from '../types';

export type UseNodesInitializedOptions = {
  includeHiddenNodes?: boolean;
};

const selector = (options: UseNodesInitializedOptions) => (s: ReactFlowState) => {
  if (s.nodeInternals.size === 0) {
    return false;
  }

  return s
    .getNodes()
    .filter((n) => (options.includeHiddenNodes ? true : !n.hidden))
    .every((n) => n[internalsSymbol]?.handleBounds !== undefined);
};

const defaultOptions = {
  includeHiddenNodes: false,
};

function useNodesInitialized(options: UseNodesInitializedOptions = defaultOptions): boolean {
  const initialized = useStore(selector(options));

  return initialized;
}

export default useNodesInitialized;

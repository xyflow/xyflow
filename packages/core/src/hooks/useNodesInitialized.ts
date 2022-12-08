import { internalsSymbol } from '../utils';
import { useStore } from './useStore';
import type { ReactFlowState } from '../types';

const selector = (s: ReactFlowState) => {
  if (s.nodeInternals.size === 0) {
    return false;
  }

  return s.getNodes().every((n) => n[internalsSymbol]?.handleBounds !== undefined);
};

function useNodesInitialized(): boolean {
  const initialized = useStore(selector);

  return initialized;
}

export default useNodesInitialized;

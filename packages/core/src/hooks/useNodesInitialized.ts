import { ReactFlowState } from '../types';
import { useStore } from './useStore';

const selector = (s: ReactFlowState) => Array.from(s.nodeInternals.values()).every((n) => n.width && n.height);

function useNodesInitialized(): boolean {
  const initialized = useStore(selector);

  return initialized;
}

export default useNodesInitialized;

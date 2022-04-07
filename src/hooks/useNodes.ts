import { useStore } from '../store';
import { Node, ReactFlowState } from '../types';

const nodesSelector = (state: ReactFlowState) => Array.from(state.nodeInternals.values());

function useNodes<NodeData>(): Node<NodeData>[] {
  const nodes = useStore(nodesSelector);

  return nodes;
}

export default useNodes;

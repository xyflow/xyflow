import { shallow } from 'zustand/shallow';

import { useStore } from '../hooks/useStore';
import type { Node, ReactFlowState } from '../types';

const nodesSelector = (state: ReactFlowState) => state.getNodes();

function useNodes<NodeData>(): Node<NodeData>[] {
  const nodes = useStore(nodesSelector, shallow);

  return nodes;
}

export default useNodes;

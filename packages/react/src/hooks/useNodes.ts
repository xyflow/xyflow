import { shallow } from 'zustand/shallow';

import { useStore } from '../hooks/useStore';
import type { Node, ReactFlowState } from '../types';

const nodesSelector = (state: ReactFlowState) => state.nodes;

function useNodes<NodeType extends Node = Node>(): NodeType[] {
  const nodes = useStore(nodesSelector, shallow) as NodeType[];

  return nodes;
}

export default useNodes;

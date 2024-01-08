import { shallow } from 'zustand/shallow';

import { useStore } from '../hooks/useStore';
import type { Node, ReactFlowState } from '../types';

const nodesSelector = (state: ReactFlowState) => state.nodes;

/**
 * Hook for getting the current nodes from the store.
 *
 * @public
 * @returns An array of nodes
 */
export function useNodes<NodeType extends Node = Node>(): NodeType[] {
  const nodes = useStore(nodesSelector, shallow) as NodeType[];

  return nodes;
}

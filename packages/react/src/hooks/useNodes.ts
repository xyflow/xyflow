import { shallow } from 'zustand/shallow';

import { useStore } from '../hooks/useStore';
import type { Node, ReactFlowState } from '../types';

const nodesSelector = (state: ReactFlowState) => state.nodes;

/**
 * This hook returns an array of the current nodes. Components that use this hook
 * will re-render **whenever any node changes**, including when a node is selected
 * or moved.
 *
 * @public
 * @returns An array of all nodes currently in the flow.
 *
 * @example
 * ```jsx
 *import { useNodes } from '@xyflow/react';
 *
 *export default function() {
 *  const nodes = useNodes();
 *
 *  return <div>There are currently {nodes.length} nodes!</div>;
 *}
 *```
 */
export function useNodes<NodeType extends Node = Node>(): NodeType[] {
  const nodes = useStore(nodesSelector, shallow) as NodeType[];

  return nodes;
}

import { useNodesStore } from './useReactFlowStore';
import type { Node } from '../types';

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
  const { nodes } = useNodesStore();

  return nodes as NodeType[];
}

/**
 * This hook returns the node with the given id. Components that use this hook
 * will re-render **whenever the node changes**.
 *
 * @public
 * @param id - The id of the node to return.
 * @returns The node with the given id.
 *
 * @example
 * ```tsx
 *import { useNode } from '@xyflow/react';
 *
 *export default function () {
 *  const node = useNode('1');
 *
 *  return <div>Node: {node?.data.label}</div>;
 *}
 *```
 */
export function useNode<NodeType extends Node = Node>(id: string): NodeType | undefined {
  const node = useNodesStore((state) => state.nodeLookup.get(id)?.internals.userNode) as NodeType | undefined;

  return node;
}

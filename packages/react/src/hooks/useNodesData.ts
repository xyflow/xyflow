import { type DistributivePick, shallowNodeData } from '@xyflow/system';

import { useCustomDiff } from './useReactFlowStore';
import { useInternalNodes } from './useNodes';
import type { Node } from '../types';

/**
 * This hook lets you subscribe to changes of a specific nodes `data` object.
 *
 * @public
 * @returns An object (or array of object) with `id`, `type`, `data` representing each node.
 *
 * @example
 *```jsx
 *import { useNodesData } from '@xyflow/react';
 *
 *export default function() {
 *  const nodeData = useNodesData('nodeId-1');
 *  const nodesData = useNodesData(['nodeId-1', 'nodeId-2']);
 *
 *  return null;
 *}
 *```
 */
export function useNodesData<NodeType extends Node = Node>(
  /** The id of the node to get the data from. */
  nodeId: string
): DistributivePick<NodeType, 'id' | 'type' | 'data'> | null;
export function useNodesData<NodeType extends Node = Node>(
  /** The ids of the nodes to get the data from. */
  nodeIds: string[]
): DistributivePick<NodeType, 'id' | 'type' | 'data'>[];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useNodesData(nodeIds: string | string[]): any {
  const isSingleId = typeof nodeIds === 'string';
  const nodes = useInternalNodes(isSingleId ? [nodeIds] : nodeIds);
  const selector = (nodes: Node[]) => {
    const data = nodes.map(({ id, type, data }) => ({ id, type, data }));
    return isSingleId ? (data[0] ?? null) : data;
  };

  return useCustomDiff(selector, shallowNodeData)(nodes);
}

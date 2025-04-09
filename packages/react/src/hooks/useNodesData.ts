import { useCallback } from 'react';
import { shallowNodeData } from '@xyflow/system';

import { useStore } from '../hooks/useStore';
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
): Pick<NodeType, 'id' | 'type' | 'data'> | null;
export function useNodesData<NodeType extends Node = Node>(
  /** The ids of the nodes to get the data from. */
  nodeIds: string[]
): Pick<NodeType, 'id' | 'type' | 'data'>[];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useNodesData(nodeIds: any): any {
  const nodesData = useStore(
    useCallback(
      (s) => {
        const data = [];
        const isArrayOfIds = Array.isArray(nodeIds);
        const _nodeIds = isArrayOfIds ? nodeIds : [nodeIds];

        for (const nodeId of _nodeIds) {
          const node = s.nodeLookup.get(nodeId);
          if (node) {
            data.push({
              id: node.id,
              type: node.type,
              data: node.data,
            });
          }
        }

        return isArrayOfIds ? data : data[0] ?? null;
      },
      [nodeIds]
    ),
    shallowNodeData
  );

  return nodesData;
}

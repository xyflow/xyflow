// import { useCallback } from 'react';
// import { shallowNodeData } from '@xyflow/system';

import { useStore } from './useStore';
import type { Node } from '../types';

/**
 * Hook for receiving data of one or multiple nodes
 *
 * @public
 * @param nodeId - The id (or ids) of the node to get the data from
 * @param guard - Optional guard function to narrow down the node type
 * @returns An object (or array of object) with {id, type, data} representing each node
 */
export function useNodesData<NodeType extends Node = Node>(
  nodeId: string
): Pick<NodeType, 'id' | 'type' | 'data'> | null;
export function useNodesData<NodeType extends Node = Node>(nodeIds: string[]): Pick<NodeType, 'id' | 'type' | 'data'>[];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useNodesData(nodeIds: any): any {
  const nodesData = useStore(
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
  );

  return nodesData;
}

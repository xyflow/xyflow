import { useCallback } from 'react';
import { shallow } from 'zustand/shallow';

import { useStore } from '../hooks/useStore';
import type { Node } from '../types';

type NodeData = Pick<Node, 'id' | 'type' | 'data'>;

function nodeDatasEqual(a: NodeData | NodeData[], b: NodeData | NodeData[]) {
  const _a = Array.isArray(a) ? a : [a];
  const _b = Array.isArray(b) ? b : [b];

  if (_a.length !== _b.length) {
    return false;
  }

  for (let i = 0; i < _a.length; i++) {
    if (!(_a[i].id === _b[i].id && _a[i].type === _b[i].type && shallow(_a[i].data, _b[i].data))) {
      return false;
    }
  }

  return true;
}

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
    nodeDatasEqual
  );

  return nodesData;
}

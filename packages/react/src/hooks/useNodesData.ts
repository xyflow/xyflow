import { useCallback } from 'react';
import { shallow } from 'zustand/shallow';

import { useStore } from '../hooks/useStore';
import type { Node } from '../types';

/**
 * Hook for receiving data of one or multiple nodes
 *
 * @public
 * @param nodeId - The id (or ids) of the node to get the data from
 * @param guard - Optional guard function to narrow down the node type
 * @returns An array od data objects
 */
export function useNodesData<NodeType extends Node = Node>(nodeId: string): NodeType['data'] | null;
export function useNodesData<NodeType extends Node = Node>(nodeIds: string[]): NodeType['data'][];
export function useNodesData<NodeType extends Node = Node>(
  nodeIds: string[],
  guard: (node: Node) => node is NodeType
): NodeType['data'][];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useNodesData(nodeIds: any): any {
  const nodesData = useStore(
    useCallback(
      (s) => {
        if (!Array.isArray(nodeIds)) {
          return s.nodeLookup.get(nodeIds)?.data || null;
        }

        const data = [];

        for (const nodeId of nodeIds) {
          const nodeData = s.nodeLookup.get(nodeId)?.data;

          if (nodeData) {
            data.push(nodeData);
          }
        }

        return data;
      },
      [nodeIds]
    ),
    shallow
  );

  return nodesData;
}

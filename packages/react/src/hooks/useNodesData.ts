import { useCallback } from 'react';
import { shallow } from 'zustand/shallow';

import { useStore } from '../hooks/useStore';

export function useNodesData<NodeData = unknown>(nodeId: string): NodeData | null;
export function useNodesData<NodeData = unknown>(nodeIds: string[]): NodeData[];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useNodesData(nodeIds: any): any {
  const nodesData = useStore(
    useCallback(
      (s) => {
        if (!Array.isArray(nodeIds)) {
          return s.nodeLookup.get(nodeIds)?.data || null;
        }

        return nodeIds.reduce((res, id) => {
          const node = s.nodeLookup.get(id);

          if (node) {
            res.push(node.data);
          }

          return res;
        }, []);
      },
      [nodeIds]
    ),
    shallow
  );

  return nodesData;
}

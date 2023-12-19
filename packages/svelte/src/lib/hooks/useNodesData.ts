import { derived, type Readable } from 'svelte/store';

import type { Node } from '$lib/types';
import { useStore } from '$lib/store';

function areNodesDataEqual(a: Node['data'][] | null, b: Node['data'][] | null) {
  if ((!a && !b) || (!a?.length && !b?.length)) {
    true;
  }

  if (!a || !b || a.length !== b.length) {
    return false;
  }

  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
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
 * @returns A readable store with an array of data objects
 */
export function useNodesData<NodeType extends Node = Node>(
  nodeId: string
): Readable<NodeType['data'] | null>;
export function useNodesData<NodeType extends Node = Node>(
  nodeIds: string[]
): Readable<NodeType['data'][]>;
export function useNodesData<NodeType extends Node = Node>(
  nodeIds: string[],
  guard: (node: Node) => node is NodeType
): Readable<NodeType['data'][]>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useNodesData(nodeIds: any): any {
  const { nodes, nodeLookup } = useStore();
  let prevNodesData: (Node['data'] | null)[] | null = null;

  return derived([nodes, nodeLookup], ([, nodeLookup], set) => {
    let nextNodesData: (Node['data'] | null)[] | null = null;
    const nodeIdArray = Array.isArray(nodeIds);

    if (!nodeIdArray) {
      nextNodesData = [nodeLookup.get(nodeIds)?.data || null];
    } else {
      const data = [];

      for (const nodeId of nodeIds) {
        const nodeData = nodeLookup.get(nodeId)?.data;

        if (nodeData) {
          data.push(nodeData);
        }
      }

      nextNodesData = data;
    }

    if (!areNodesDataEqual(nextNodesData, prevNodesData)) {
      prevNodesData = nextNodesData;
      set(nodeIdArray ? nextNodesData : nextNodesData[0]);
    }
  });
}

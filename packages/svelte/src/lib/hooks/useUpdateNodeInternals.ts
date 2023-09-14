import { get } from 'svelte/store';
import type { UpdateNodeInternals, NodeDimensionUpdate } from '@xyflow/system';

import { useStore } from '$lib/store';

export function useUpdateNodeInternals(): UpdateNodeInternals {
  const { domNode, updateNodeDimensions } = useStore();

  // @todo: do we want to add this to system?
  const updateInternals = (id: string | string[]) => {
    const updateIds = Array.isArray(id) ? id : [id];
    const updates = updateIds.reduce<NodeDimensionUpdate[]>((res, updateId) => {
      const nodeElement = get(domNode)?.querySelector(
        `.svelte-flow__node[data-id="${updateId}"]`
      ) as HTMLDivElement;

      if (nodeElement) {
        res.push({ id: updateId, nodeElement, forceUpdate: true });
      }

      return res;
    }, []);

    requestAnimationFrame(() => updateNodeDimensions(updates));
  };

  return updateInternals;
}

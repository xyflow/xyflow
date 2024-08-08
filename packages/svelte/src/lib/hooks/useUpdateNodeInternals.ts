import { get } from 'svelte/store';
import type { Dimensions, UpdateNodeInternals } from '@xyflow/system';

import { useStore } from '$lib/store';

/**
 * Hook for updating node internals.
 *
 * @public
 * @returns function for updating node internals
 */
export function useUpdateNodeInternals(): UpdateNodeInternals {
  const { domNode, updateNodeInternals, nodeLookup } = useStore();

  // @todo: do we want to add this to system?
  const updateInternals = (id: string | string[]) => {
    const updateIds = Array.isArray(id) ? id : [id];
    const updates = new Map();

    updateIds.forEach((updateId) => {
      const nodeElement = get(domNode)?.querySelector(
        `.svelte-flow__node[data-id="${updateId}"]`
      ) as HTMLDivElement;
      const node = get(nodeLookup).get(updateId);

      if (nodeElement && node) {
        const dimensions =
          node.measured.width && node.measured.height ? (node.measured as Dimensions) : undefined;
        updates.set(updateId, { id: updateId, nodeElement, dimensions, force: true });
      }
    });

    requestAnimationFrame(() => updateNodeInternals(updates));
  };

  return updateInternals;
}

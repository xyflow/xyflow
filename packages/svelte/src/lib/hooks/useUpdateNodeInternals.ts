import { get } from 'svelte/store';
import type { UpdateNodeInternals } from '@xyflow/system';

import { useStore } from '$lib/store';

/**
 * Hook for updating node internals.
 *
 * @public
 * @returns function for updating node internals
 */
export function useUpdateNodeInternals(): UpdateNodeInternals {
  const store = useStore();

  // @todo: do we want to add this to system?
  const updateInternals = (id: string | string[]) => {
    const updateIds = Array.isArray(id) ? id : [id];
    const updates = new Map();

    updateIds.forEach((updateId) => {
      const nodeElement = store.domNode?.querySelector(
        `.svelte-flow__node[data-id="${updateId}"]`
      ) as HTMLDivElement;

      if (nodeElement) {
        updates.set(updateId, { id: updateId, nodeElement, force: true });
      }
    });

    requestAnimationFrame(() => store.updateNodeInternals(updates));
  };

  return updateInternals;
}

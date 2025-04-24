import { useStore } from '$lib/store';
import { getContext } from 'svelte';

/**
 * Hook for updating node internals.
 *
 * @public
 * @returns function for updating node internals
 */
export function useUpdateNodeInternals(): (nodeId?: string | string[]) => void {
  const { domNode, updateNodeInternals } = $derived(useStore());
  const nodeId = getContext('svelteflow__node_id') as string | undefined;

  // @todo: do we want to add this to system?
  const updateInternals = (id?: string | string[]) => {
    if (!id && !nodeId) {
      throw new Error('When using outside of a node, you must provide an id.');
    }
    const updateIds = id ? (Array.isArray(id) ? id : [id]) : [nodeId];
    const updates = new Map();

    updateIds.forEach((updateId) => {
      const nodeElement = domNode?.querySelector(
        `.svelte-flow__node[data-id="${updateId}"]`
      ) as HTMLDivElement;

      if (nodeElement) {
        updates.set(updateId, { id: updateId, nodeElement, force: true });
      }
    });

    requestAnimationFrame(() => updateNodeInternals(updates));
  };

  return updateInternals;
}

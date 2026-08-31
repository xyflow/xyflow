/* eslint-disable svelte/prefer-svelte-reactivity */
import { useSvelteFlowStore } from '$lib/store/index.js';
import { getNodeIdContext } from '$lib/store/context.js';
import { tick } from 'svelte';

/**
 * When you programmatically add or remove handles to a node or update a node's
 * handle position, you need to let Svelte Flow know about it using this hook. This
 * will update the internal dimensions of the node and properly reposition handles
 * on the canvas if necessary.
 *
 * @public
 * @returns A function that tells React Flow to update the internal state of one or more
 * nodes that you have changed programmatically. Returns a `Promise<void>` that resolves
 * after the next animation frame, once node dimensions have been re-measured and the store
 * updated. `await` it before reading dimension-dependent state.
 */
export function useUpdateNodeInternals(): (nodeId?: string | string[]) => Promise<void> {
  const { domNode, updateNodeInternals } = $derived(useSvelteFlowStore());
  const nodeId = getNodeIdContext();

  // @todo: do we want to add this to system?
  const updateInternals = (id?: string | string[]): Promise<void> => {
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

    return tick().then(() => {
      try {
        updateNodeInternals(updates);
      } catch (error) {
        throw error;
      }
    })
  };

  return updateInternals;
}

/* eslint-enable svelte/prefer-svelte-reactivity */

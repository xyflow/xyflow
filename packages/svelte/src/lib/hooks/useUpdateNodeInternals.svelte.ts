/* eslint-disable svelte/prefer-svelte-reactivity */
import { useStore } from '$lib/store';
import { getNodeIdContext } from '$lib/store/context';

/**
 * When you programmatically add or remove handles to a node or update a node's
 * handle position, you need to let Svelte Flow know about it using this hook. This
 * will update the internal dimensions of the node and properly reposition handles
 * on the canvas if necessary.
 *
 * @public
 * @returns A function for telling Svelte Flow to update the internal state of one or more nodes
 * that you have changed programmatically.
 */
export function useUpdateNodeInternals(): (nodeId?: string | string[]) => void {
  const { domNode, updateNodeInternals } = $derived(useStore());
  const nodeId = getNodeIdContext();

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

/* eslint-enable svelte/prefer-svelte-reactivity */

import { useStore } from '$lib/store';
import type { InternalNode } from '$lib/types';

/**
 * Hook to get an internal node by id.
 *
 * @public
 * @param params - A function that returns the hook parameters
 * @param params.id - the node id
 * @returns An internal node or undefined
 */
export function useInternalNode(params: () => { id: string }): { current: InternalNode | undefined } {
  const { nodeLookup, nodes } = $derived(useStore());

  const node = $derived.by(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    nodes;
    const { id } = params();
    return nodeLookup.get(id);
  });

  return {
    get current() {
      return node;
    }
  };
}

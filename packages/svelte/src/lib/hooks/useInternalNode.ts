import { derived, type Readable } from 'svelte/store';

import { useStore } from '$lib/store';
import type { InternalNode } from '$lib/types';

/**
 * Hook to get an internal node by id.
 *
 * @public
 * @param id - the node id
 * @returns a readable with an internal node or undefined
 */
export function useInternalNode(id: string): Readable<InternalNode | undefined> {
  const { nodeLookup, nodes } = useStore();

  return derived([nodeLookup, nodes], ([nodeLookup]) => nodeLookup.get(id));
}

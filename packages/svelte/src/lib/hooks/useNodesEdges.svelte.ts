import { useStore } from '$lib/store';

/**
 * Hook for getting the current nodes from the store.
 *
 * @public
 * @returns store with an array of nodes
 */
export function useNodes() {
  const { nodes } = $derived(useStore());
  return {
    get current() {
      return nodes;
    }
  };
}

/**
 * Hook for getting the current edges from the store.
 *
 * @public
 * @returns store with an array of edges
 */
export function useEdges() {
  const { edges } = $derived(useStore());
  return {
    get current() {
      return edges;
    }
  };
}

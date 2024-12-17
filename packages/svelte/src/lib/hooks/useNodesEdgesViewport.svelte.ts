import { useStore } from '$lib/store';

/**
 * Hook for getting the current nodes from the store.
 *
 * @public
 * @returns reactive signal of the current edges
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
 * @returns reactive signal of the current edges
 */
export function useEdges() {
  const { edges } = $derived(useStore());
  return {
    get current() {
      return edges;
    }
  };
}

/**
 * Hook for getting the current viewport from the store.
 *
 * @public
 * @returns reactive signal of the current viewport
 */
export function useViewport() {
  const { viewport } = $derived(useStore());
  return {
    get current() {
      return viewport;
    }
  };
}

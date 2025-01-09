import { useStore } from '$lib/store';

/**
 * Hook for getting the current nodes from the store.
 *
 * @public
 * @returns reactive signal of the current edges
 */
export function useNodes() {
  const store = $derived(useStore());
  return {
    get current() {
      return store.nodes;
    },
    set current(val) {
      store.nodes = val;
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
  const store = $derived(useStore());
  return {
    get current() {
      return store.edges;
    },
    set current(val) {
      store.edges = val;
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
  const store = $derived(useStore());
  return {
    get current() {
      return store.viewport;
    },
    set current(val) {
      store.viewport = val;
    }
  };
}

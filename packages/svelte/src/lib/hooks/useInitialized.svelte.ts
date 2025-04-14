import { useStore } from '$lib/store';

/**
 * Hook for seeing if nodes are initialized
 * @returns - reactive nodesInitialized
 */
export function useNodesInitialized() {
  const { nodesInitialized } = $derived(useStore());
  return {
    get current() {
      return nodesInitialized;
    }
  };
}

/**
 * Hook for seeing if the viewport is initialized
 * @returns - reactive viewportInitialized
 */
export function useViewportInitialized() {
  const { viewportInitialized } = $derived(useStore());
  return {
    get current() {
      return viewportInitialized;
    }
  };
}

import { useSvelteFlowStore } from '$lib/store/index.js';

/**
 * Hook for seeing if nodes are initialized
 * @returns A boolean that indicates if nodes are initialized
 * @public
 */
export function useNodesInitialized() {
  const { nodesInitialized } = $derived(useSvelteFlowStore());
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
  const { viewportInitialized } = $derived(useSvelteFlowStore());
  return {
    get current() {
      return viewportInitialized;
    }
  };
}

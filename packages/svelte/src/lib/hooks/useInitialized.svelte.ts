import { useStore } from '$lib/store';

/**
 * Hook for seeing if nodes are initialized
 * @returns - nodesInitialized Writable
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
 * Hook for seeing if the flow is initialized
 * @returns - initialized Writable
 */
export function useInitialized() {
  const { initialized } = $derived(useStore());
  return {
    get current() {
      return initialized;
    }
  };
}

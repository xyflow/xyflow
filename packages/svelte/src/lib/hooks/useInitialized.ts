import { useStore } from '$lib/store';

/**
 * Hook for seeing if nodes are initialized
 * @returns - nodesInitialized Writable
 */
export function useNodesInitialized() {
  const { nodesInitialized } = useStore();
  return nodesInitialized;
}

/**
 * Hook for seeing if edges are initialized
 * @returns - edgesInitialized Writable
 */
export function useEdgesInitialized() {
  const { edgesInitialized } = useStore();
  return edgesInitialized;
}

/**
 * Hook for seeing if the flow is initialized
 * @returns - initialized Writable
 */
export function useInitialized() {
  const { initialized } = useStore();
  return initialized;
}

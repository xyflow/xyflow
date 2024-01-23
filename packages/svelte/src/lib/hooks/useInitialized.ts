import { useStore } from '$lib/store';
import type { Readable } from 'svelte/store';

/**
 * Hook for seeing if nodes are initialized
 * @returns - nodesInitialized Writable
 */
export function useNodesInitialized() {
  const { nodesInitialized } = useStore();
  return {
    subscribe: nodesInitialized.subscribe
  } as Readable<boolean>;
}

/**
 * Hook for seeing if the flow is initialized
 * @returns - initialized Writable
 */
export function useInitialized() {
  const { initialized } = useStore();
  return {
    subscribe: initialized.subscribe
  } as Readable<boolean>;
}

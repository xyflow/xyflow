import { useStore } from '$lib/store';
import { readable, type Readable } from 'svelte/store';

//TODO: this does not work

/**
 * Hook for seeing if nodes are initialized
 * @returns - nodesInitialized Writable
 */
export function useNodesInitialized() {
  const store = useStore();

  let initialized = readable<boolean>(store.nodesInitialized);
  return {
    subscribe: initialized.subscribe
  } as Readable<boolean>;
}

/**
 * Hook for seeing if the flow is initialized
 * @returns - initialized Writable
 */
export function useInitialized() {
  const store = useStore();

  let initialized = readable<boolean>(store.nodesInitialized);
  return {
    subscribe: initialized.subscribe
  } as Readable<boolean>;
}

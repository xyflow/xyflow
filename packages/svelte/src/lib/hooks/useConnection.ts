import { readable, type Readable } from 'svelte/store';

import { useStore } from '$lib/store';
// import type { ConnectionProps } from '$lib/store/derived-connection-props';

// TODO: this does not work

/**
 * Hook for receiving the current connection.
 *
 * @public
 * @returns current connection as a readable store
 */
export function useConnection(): Readable<any> {
  const store = useStore();

  const readConnection = readable(store.connection);

  return readConnection;
}

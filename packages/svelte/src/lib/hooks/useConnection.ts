import type { Readable } from 'svelte/store';

import { useStore } from '$lib/store';
import type { ConnectionProps } from '$lib/store/derived-connection-props';

/**
 * Hook for receiving the current connection.
 *
 * @public
 * @returns current connection as a readable store
 */
export function useConnection(): Readable<ConnectionProps> {
  const { connection } = useStore();

  return connection;
}

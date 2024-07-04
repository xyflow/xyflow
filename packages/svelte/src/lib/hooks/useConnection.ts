import type { Readable } from 'svelte/store';
import { useStore } from '$lib/store';

import type { ConnectionState } from '@xyflow/system';

/**
 * Hook for receiving the current connection.
 *
 * @public
 * @returns current connection as a readable store
 */
export function useConnection(): Readable<ConnectionState> {
  const { connection } = useStore();

  return connection;
}

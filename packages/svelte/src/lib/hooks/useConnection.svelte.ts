import { useStore } from '$lib/store';

import type { ConnectionState } from '@xyflow/system';
import { derivedWarning } from './derivedWarning.svelte';

/**
 * Hook for receiving the current connection.
 *
 * @public
 * @returns current connection as a readable store
 */
export function useConnection(): ConnectionState {
  if (process.env.NODE_ENV === 'development') {
    derivedWarning('useConnection', true);
  }

  return useStore().connection;
}

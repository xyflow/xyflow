import { useSvelteFlowStore } from '$lib/store/index.js';

import type { ConnectionState } from '@xyflow/system';

/**
 * Hook for receiving the current connection.
 *
 * @public
 * @returns Current connection as a signal
 */
export function useConnection(): { current: ConnectionState } {
  const { connection } = $derived(useSvelteFlowStore());

  return {
    get current() {
      return connection;
    }
  };
}

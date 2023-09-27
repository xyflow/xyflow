import type { Readable } from 'svelte/store';

import { useStore } from '$lib/store';
import type { ConnectionProps } from '$lib/store/derived-connection-props';

export function useConnection(): Readable<ConnectionProps> {
  const { connection } = useStore();

  return connection;
}

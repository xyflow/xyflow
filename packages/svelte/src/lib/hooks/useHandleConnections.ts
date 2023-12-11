import { derived } from 'svelte/store';
import { areConnectionMapsEqual, type Connection, type HandleType } from '@xyflow/system';

import { useStore } from '$lib/store';

export type useHandleConnectionsParams = {
  nodeId: string;
  type: HandleType;
  id?: string | null;
};

const initialConnections: Connection[] = [];

export function useHandleConnections({ nodeId, type, id = null }: useHandleConnectionsParams) {
  const { edges, connectionLookup } = useStore();
  let prevConnections: Map<string, Connection> | undefined = undefined;

  return derived(
    [edges, connectionLookup],
    ([, connectionLookup], set) => {
      const nextConnections = connectionLookup.get(`${nodeId}-${type}-${id || null}`);

      if (!areConnectionMapsEqual(nextConnections, prevConnections)) {
        prevConnections = nextConnections;
        set(Array.from(prevConnections?.values() || []));
      }
    },
    initialConnections
  );
}

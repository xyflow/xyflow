import { getContext } from 'svelte';
import { derived } from 'svelte/store';
import {
  areConnectionMapsEqual,
  XYError,
  XYErrorCode,
  type NodeConnection,
  type HandleType
} from '@xyflow/system';

import { useStore } from '$lib/store';

type UseNodeConnectionsParams = {
  id?: string;
  handleType?: HandleType;
  handleId?: string;
  // TODO: Svelte 5
  //   onConnect?: (connections: Connection[]) => void;
  //   onDisconnect?: (connections: Connection[]) => void;
};

const initialConnections: NodeConnection[] = [];

/**
 * Hook to retrieve all edges connected to a node. Can be filtered by handle type and id.
 *
 * @public
 * @param param.id - node id - optional if called inside a custom node
 * @param param.handleType - filter by handle type 'source' or 'target'
 * @param param.handleId - filter by handle id (this is only needed if the node has multiple handles of the same type)
 * @todo @param param.onConnect - gets called when a connection is established
 * @todo @param param.onDisconnect - gets called when a connection is removed
 * @returns an array with connections
 */
export function useNodeConnections({ id, handleType, handleId }: UseNodeConnectionsParams = {}) {
  const { edges, connectionLookup } = useStore();

  const nodeId = getContext<string>('svelteflow__node_id');
  const currentNodeId = id ?? nodeId;

  if (!currentNodeId) {
    throw new XYError(XYErrorCode.USE_NODE_CONNECTIONS_NO_ID);
  }

  let prevConnections: Map<string, NodeConnection> | undefined = undefined;

  return derived(
    [edges, connectionLookup],
    ([, connectionLookup], set) => {
      const nextConnections = connectionLookup.get(
        `${currentNodeId}${handleType ? (handleId ? `-${handleType}-${handleId}` : `-${handleType}`) : ''}`
      );

      if (!areConnectionMapsEqual(nextConnections, prevConnections)) {
        prevConnections = nextConnections;
        set(Array.from(prevConnections?.values() || []));
      }
    },
    initialConnections
  );
}

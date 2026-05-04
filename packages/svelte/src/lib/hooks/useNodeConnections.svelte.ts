/* eslint-disable svelte/prefer-svelte-reactivity */
import {
  areConnectionMapsEqual,
  handleConnectionChange,
  type NodeConnection,
  type HandleType,
  type HandleConnection
} from '@xyflow/system';

import { useStore } from '$lib/store';
import { getNodeIdContext } from '$lib/store/context';

type UseNodeConnectionsParams = {
  id?: string;
  handleType?: HandleType;
  handleId?: string;
  onConnect?: (connections: HandleConnection[]) => void;
  onDisconnect?: (connections: HandleConnection[]) => void;
};

type ConnectionMap = Map<string, NodeConnection>;

const initialConnections: NodeConnection[] = [];

/**
 * Hook to retrieve all edges connected to a node. Can be filtered by handle type and id.
 *
 * @public
 * @param param.id - node id - optional if called inside a custom node
 * @param param.handleType - filter by handle type 'source' or 'target'
 * @param param.handleId - filter by handle id (this is only needed if the node has multiple handles of the same type)
 * @param param.onConnect - gets called when a connection is established
 * @param param.onDisconnect - gets called when a connection is removed
 * @returns An array with connections
 */
export function useNodeConnections({
  id,
  handleType,
  handleId,
  onConnect,
  onDisconnect
}: UseNodeConnectionsParams = {}) {
  const { edges, connectionLookup } = $derived(useStore());

  const contextNodeId = getNodeIdContext();
  const nodeId = id ?? contextNodeId;

  let connectionMaps: { previous: ConnectionMap; next: ConnectionMap } = {
    previous: new Map(),
    next: new Map()
  };
  let connectionsArray: NodeConnection[] = initialConnections;

  const connections = $derived.by(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    edges;

    const prevConnections = connectionMaps.next;
    const nextConnections =
      connectionLookup.get(
        `${nodeId}${handleType ? (handleId ? `-${handleType}-${handleId}` : `-${handleType}`) : ''}`
      ) ?? new Map();
    if (!areConnectionMapsEqual(nextConnections, prevConnections)) {
      connectionMaps = {
        previous: prevConnections,
        next: nextConnections
      };
      connectionsArray = Array.from(nextConnections.values() || initialConnections);
    }
    return connectionsArray;
  });

  $effect(() => {
    // We subscribe to changes to the connections only when onConnect/onDisconnect are provided
    if (onConnect) {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      connections;
      handleConnectionChange(connectionMaps.next, connectionMaps.previous, onConnect);
    }

    if (onDisconnect) {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      connections;
      handleConnectionChange(connectionMaps.previous, connectionMaps.next, onDisconnect);
    }
  });

  return {
    get current() {
      return connections;
    }
  };
}

/* eslint-enable svelte/prefer-svelte-reactivity */

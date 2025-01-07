import { derived } from 'svelte/store';
import {
  areConnectionMapsEqual,
  errorMessages,
  type HandleConnection,
  type HandleType
} from '@xyflow/system';

import { useStore } from '$lib/store';
import { getContext } from 'svelte';

const error014 = errorMessages['error014']();

type UseNodeConnectionsParams = {
  type?: HandleType;
  handleId?: string;
  nodeId?: string;
  // TODO: Svelte 5
  //   onConnect?: (connections: Connection[]) => void;
  //   onDisconnect?: (connections: Connection[]) => void;
};

const initialConnections: HandleConnection[] = [];

/**
 * Hook to retrieve all edges connected to a node. Can be filtered by handle type and id.
 *
 * @public
 * @param param.nodeId - node id - optional if called inside a custom node
 * @param param.type - filter by handle type 'source' or 'target'
 * @param param.handleId - filter by handle id (this is only needed if the node has multiple handles of the same type)
 * @todo @param param.onConnect - gets called when a connection is established
 * @todo @param param.onDisconnect - gets called when a connection is removed
 * @returns an array with connections
 */
export function useNodeConnections({ type, nodeId, handleId }: UseNodeConnectionsParams) {
  const { edges, connectionLookup } = useStore();

  const _nodeId = getContext<string>('svelteflow__node_id');
  const currentNodeId = nodeId ?? _nodeId;

  if (!currentNodeId) {
    throw new Error(error014);
  }

  let prevConnections: Map<string, HandleConnection> | undefined = undefined;

  return derived(
    [edges, connectionLookup],
    ([, connectionLookup], set) => {
      const nextConnections = connectionLookup.get(
        `${currentNodeId}${type ? (handleId ? `-${type}-${handleId}` : `-${type}`) : ''}`
      );

      if (!areConnectionMapsEqual(nextConnections, prevConnections)) {
        prevConnections = nextConnections;
        set(Array.from(prevConnections?.values() || []));
      }
    },
    initialConnections
  );
}

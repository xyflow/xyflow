import { areConnectionMapsEqual, type HandleConnection, type HandleType } from '@xyflow/system';

import { useStore } from '$lib/store';
import { getContext } from 'svelte';

export type useHandleConnectionsParams = {
  type: HandleType;
  nodeId?: string;
  id?: string | null;
};

const initialConnections: HandleConnection[] = [];

/**
 *  Hook to check if a <Handle /> is connected to another <Handle /> and get the connections.
 *
 * @public
 * @param param.nodeId
 * @param param.type - handle type 'source' or 'target'
 * @param param.id - the handle id (this is only needed if the node has multiple handles of the same type)
 * @returns an array with connections
 */
export function useHandleConnections({
  type,
  nodeId: _nodeId,
  id = null
}: useHandleConnectionsParams) {
  const { edges, connectionLookup } = $derived(useStore());

  const contextNodeId = getContext<string>('svelteflow__node_id');
  const nodeId = _nodeId ?? contextNodeId;

  let prevConnections: Map<string, HandleConnection> | undefined = new Map();
  let connectionsArray: HandleConnection[] = initialConnections;

  const connections = $derived.by(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    edges;
    const nextConnections = connectionLookup.get(`${nodeId}-${type}-${id || null}`);
    if (!areConnectionMapsEqual(nextConnections, prevConnections)) {
      prevConnections = nextConnections;
      connectionsArray = Array.from(nextConnections?.values() || initialConnections);
    }
    return connectionsArray;
  });

  return {
    get current() {
      return connections;
    }
  };
}

import { useEffect, useMemo, useRef } from 'react';
import { Connection, HandleType, areConnectionMapsEqual, handleConnectionChange } from '@xyflow/system';

import { useStore } from './useStore';
import { useNodeId } from '../contexts/NodeIdContext';

type useHandleConnectionsParams = {
  handleType: HandleType;
  nodeId?: string;
  handleId?: string | null;
  onConnect?: (connections: Connection[]) => void;
  onDisconnect?: (connections: Connection[]) => void;
};

/**
 *  Hook to check if a <Handle /> is connected to another <Handle /> and get the connections.
 *
 * @public
 * @param param.handleType - 'source' or 'target'
 * @param param.handleId - the handle id (this is only needed if the node has multiple handles of the same type)
 * @param param.nodeId - node id - if not provided, the node id from the NodeIdContext is used
 * @param param.onConnect - gets called when a connection is established
 * @param param.onDisconnect - gets called when a connection is removed
 * @returns an array with connections
 */
export function useHandleConnections({
  handleType,
  handleId = null,
  nodeId,
  onConnect,
  onDisconnect,
}: useHandleConnectionsParams): Connection[] {
  const _nodeId = useNodeId();
  const prevConnections = useRef<Map<string, Connection> | null>(null);
  const currentNodeId = nodeId || _nodeId;

  const connections = useStore(
    (state) => state.connectionLookup.get(`${currentNodeId}-${handleType}-${handleId}`),
    areConnectionMapsEqual
  );

  useEffect(() => {
    // @todo dicuss if onConnect/onDisconnect should be called when the component mounts/unmounts
    if (prevConnections.current && prevConnections.current !== connections) {
      const _connections = connections ?? new Map();
      handleConnectionChange(prevConnections.current, _connections, onDisconnect);
      handleConnectionChange(_connections, prevConnections.current, onConnect);
    }

    prevConnections.current = connections ?? new Map();
  }, [connections, onConnect, onDisconnect]);

  return useMemo(() => Array.from(connections?.values() ?? []), [connections]);
}

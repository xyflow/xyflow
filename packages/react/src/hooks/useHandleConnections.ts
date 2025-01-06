import { useEffect, useMemo, useRef } from 'react';
import {
  Connection,
  HandleConnection,
  HandleType,
  areConnectionMapsEqual,
  handleConnectionChange,
} from '@xyflow/system';

import { useStore } from './useStore';
import { useNodeId } from '../contexts/NodeIdContext';

type useHandleConnectionsParams = {
  type: HandleType;
  id?: string | null;
  nodeId?: string;
  onConnect?: (connections: Connection[]) => void;
  onDisconnect?: (connections: Connection[]) => void;
};

/**
 * Hook to check if a <Handle /> is connected to another <Handle /> and get the connections.
 *
 * @public
 * @param param.type - handle type 'source' or 'target'
 * @param param.nodeId - node id - if not provided, the node id from the NodeIdContext is used
 * @param param.id - the handle id (this is only needed if the node has multiple handles of the same type)
 * @param param.onConnect - gets called when a connection is established
 * @param param.onDisconnect - gets called when a connection is removed
 * @returns an array with handle connections
 */
export function useHandleConnections({
  type,
  id = null,
  nodeId,
  onConnect,
  onDisconnect,
}: useHandleConnectionsParams): HandleConnection[] {
  const _nodeId = useNodeId();
  const currentNodeId = nodeId ?? _nodeId;

  const prevConnections = useRef<Map<string, HandleConnection> | null>(null);

  const connections = useStore(
    (state) => state.connectionLookup.get(`${currentNodeId}-${type}-${id}`),
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

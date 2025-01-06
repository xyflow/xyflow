import { useEffect, useMemo, useRef } from 'react';
import {
  Connection,
  HandleConnection,
  HandleType,
  areConnectionMapsEqual,
  handleConnectionChange,
  errorMessages,
} from '@xyflow/system';

import { useStore } from './useStore';
import { useNodeId } from '../contexts/NodeIdContext';

const error014 = errorMessages['error014']();

type UseNodeConnectionsParams = {
  type?: HandleType;
  handleId?: string;
  nodeId?: string;
  onConnect?: (connections: Connection[]) => void;
  onDisconnect?: (connections: Connection[]) => void;
};

/**
 * Hook to retrieve all edges connected to a node. Can be filtered by handle type and id.
 *
 * @public
 * @param param.nodeId - node id - optional if called inside a custom node
 * @param param.type - filter by handle type 'source' or 'target'
 * @param param.handleId - filter by handle id (this is only needed if the node has multiple handles of the same type)
 * @param param.onConnect - gets called when a connection is established
 * @param param.onDisconnect - gets called when a connection is removed
 * @returns an array with connections
 */
export function useHandleConnections({
  type,
  handleId,
  nodeId,
  onConnect,
  onDisconnect,
}: UseNodeConnectionsParams): HandleConnection[] {
  const _nodeId = useNodeId();
  const currentNodeId = nodeId ?? _nodeId;

  if (!currentNodeId) {
    throw new Error(error014);
  }

  const prevConnections = useRef<Map<string, HandleConnection> | null>(null);

  const connections = useStore(
    (state) =>
      state.connectionLookup.get(`${currentNodeId}${type ? (handleId ? `-${type}-${handleId}` : `-${type}`) : ''}`),
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

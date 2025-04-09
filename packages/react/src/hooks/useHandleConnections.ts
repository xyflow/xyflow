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

type UseHandleConnectionsParams = {
  /** What type of handle connections do you want to observe? */
  type: HandleType;
  /** The handle id (this is only needed if the node has multiple handles of the same type). */
  id?: string | null;
  /** If node id is not provided, the node id from the `NodeIdContext` is used. */
  nodeId?: string;
  /** Gets called when a connection is established. */
  onConnect?: (connections: Connection[]) => void;
  /** Gets called when a connection is removed. */
  onDisconnect?: (connections: Connection[]) => void;
};

/**
 * Hook to check if a <Handle /> is connected to another <Handle /> and get the connections.
 *
 * @public
 * @deprecated Use `useNodeConnections` instead.
 * @returns An array with handle connections.
 */
export function useHandleConnections({
  type,
  id,
  nodeId,
  onConnect,
  onDisconnect,
}: UseHandleConnectionsParams): HandleConnection[] {
  console.warn(
    '[DEPRECATED] `useHandleConnections` is deprecated. Instead use `useNodeConnections` https://reactflow.dev/api-reference/hooks/useNodeConnections'
  );

  const _nodeId = useNodeId();
  const currentNodeId = nodeId ?? _nodeId;

  const prevConnections = useRef<Map<string, HandleConnection> | null>(null);

  const connections = useStore(
    (state) => state.connectionLookup.get(`${currentNodeId}-${type}${id ? `-${id}` : ''}`),
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

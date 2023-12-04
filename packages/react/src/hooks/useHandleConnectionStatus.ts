import { useEffect, useMemo, useRef } from 'react';
import { Connection, HandleType } from '@xyflow/system';

import { useStore } from './useStore';
import { useNodeId } from '../contexts/NodeIdContext';
import { areConnectionsEqual, isSameConnection } from '../utils/general';

type useHandleConnectionStatusParams = {
  handleType: HandleType;
  nodeId?: string;
  handleId?: string | null;
  onConnect?: (connections: Connection[]) => void;
  onDisconnect?: (connections: Connection[]) => void;
};

export function useHandleConnectionStatus({
  handleType,
  nodeId,
  handleId = null,
  onConnect,
  onDisconnect,
}: useHandleConnectionStatusParams): {
  connected: boolean;
  connections: Connection[] | null;
} {
  const _nodeId = useNodeId();
  const prevConnections = useRef<Connection[] | null>(null);
  const currentNodeId = nodeId || _nodeId;

  const connections = useStore(
    (state) => state.connectionLookup.get(`${currentNodeId}-${handleType}-${handleId}`) || null,
    areConnectionsEqual
  );

  useEffect(() => {
    // @todo dicuss if onConnect/onDisconnect should be called when the component mounts/unmounts
    if (prevConnections.current && prevConnections.current !== connections) {
      const disconnectedConnections = prevConnections.current.filter(
        (prevConnection) => !connections?.find((connection) => isSameConnection(connection, prevConnection))
      );

      const newConnections = connections?.filter(
        (connection) => !prevConnections.current?.find((prevConnection) => isSameConnection(prevConnection, connection))
      );

      if (disconnectedConnections.length) {
        onDisconnect?.(disconnectedConnections);
      }

      if (newConnections?.length) {
        onConnect?.(newConnections);
      }
    }

    prevConnections.current = connections ?? [];
  }, [connections, onConnect, onDisconnect]);

  return useMemo(
    () => ({
      connected: !!connections,
      connections,
    }),
    [connections]
  );
}

import { useEffect, useMemo, useRef } from 'react';
import { Connection, HandleType } from '@xyflow/system';

import { useStore } from './useStore';
import { useNodeId } from '../contexts/NodeIdContext';

type useHandleConnectionStatusParams = {
  handleType: HandleType;
  nodeId?: string;
  handleId?: string | null;
  onConnect?: (connections: Connection[]) => void;
  onDisconnect?: (connections: Connection[]) => void;
};

function connectionsEqual(a: Connection[] | null, b: Connection[] | null) {
  if (!a && !b) {
    return true;
  }

  if (!a || !b) {
    return false;
  }

  if (a.length !== b.length) {
    return false;
  }

  return a.every((connA) =>
    b.find(
      (connB) =>
        connA.source === connB.source &&
        connA.target === connB.target &&
        connA.sourceHandle === connB.sourceHandle &&
        connA.targetHandle === connB.targetHandle
    )
  );
}

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
    connectionsEqual
  );

  useEffect(() => {
    // we don't want to trigger the handlers for the initial render
    if (prevConnections.current && prevConnections.current !== connections) {
      if (prevConnections.current?.length > (connections?.length ?? 0)) {
        const disconnect = prevConnections.current.filter(
          (prevConnection) => !connections?.find((connection) => connection.source === prevConnection.source)
        );
        onDisconnect?.(disconnect);
      } else if (connections?.length) {
        const connect = connections.filter(
          (connection) =>
            !prevConnections.current?.find((prevConnection) => prevConnection.source === connection.source)
        );
        onConnect?.(connect);
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

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

function areConnectionMapsEqual(a?: Map<string, Connection>, b?: Map<string, Connection>) {
  if (!a && !b) {
    return true;
  }

  if (!a || !b || a.size !== b.size) {
    return false;
  }

  if (!a.size && !b.size) {
    return true;
  }

  for (const key of a.keys()) {
    if (!b.has(key)) {
      return false;
    }
  }

  return true;
}

/**
 * We call the callback for all connections in a that are not in b
 * @internal
 */
function handleConnectionChange(
  a: Map<string, Connection>,
  b: Map<string, Connection>,
  cb?: (diff: Connection[]) => void
) {
  if (!cb) {
    return;
  }

  const diff: Connection[] = [];

  a.forEach((connection, key) => {
    if (!b?.has(key)) {
      diff.push(connection);
    }
  });

  if (diff.length) {
    cb(diff);
  }
}

/**
 *  Hook to check if a <Handle /> is connected to another <Handle /> and get the connections.
 *
 * @public
 * @param param.handleType - 'source' or 'target'
 * @param param.handleId - the handle id (this is only needed if the node has multiple handles of the same type)
 * @param param.nodeId - node id - if not provided, the node id from the NodeIdContext is used
 * @param param.onConnect - gets called when a connection is established
 * @param param.onDisconnect - gets called when a connection is removed
 * @returns a `connected` boolean and a connections array
 */
export function useHandleConnectionStatus({
  handleType,
  handleId = null,
  nodeId,
  onConnect,
  onDisconnect,
}: useHandleConnectionStatusParams): {
  connected: boolean;
  connections: Connection[] | null;
} {
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

  return useMemo(
    () => ({
      connected: !!connections,
      connections: Array.from(connections?.values() ?? []),
    }),
    [connections]
  );
}

import { Connection, HandleConnection, HandleType, handleConnectionChange } from '@xyflow/system';

import { useStore } from './useStore';
import { useNodeId } from '../contexts/NodeIdContext';
import { createEffect } from 'solid-js';
import { useRef } from '../utils/hooks';
import { ReactiveMap } from '@solid-primitives/map';

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
 * @deprecated Use `useNodeConnections` instead.
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
}: useHandleConnectionsParams): () => HandleConnection[] {
  const _nodeId = useNodeId();
  const currentNodeId = nodeId ?? _nodeId;

  if (process.env.NODE_ENV === 'development') {
    console.warn(
      '[DEPRECATED] `useHandleConnections` is deprecated. Instead use `useNodeConnections` https://reactflow.dev/api-reference/hooks/useNodeConnections'
    );
  }

  const prevConnections = useRef<(() => Map<string, HandleConnection>) | null>(null);

  const connections = useStore((state) => () => state.connectionLookup.get(`${currentNodeId}-${type}-${id}`));

  createEffect(() => {
    // @todo discuss if onConnect/onDisconnect should be called when the component mounts/unmounts
    if (prevConnections.current && prevConnections.current() !== connections()) {
      const _connections = connections() ?? new ReactiveMap<string, HandleConnection>();
      handleConnectionChange(prevConnections.current(), _connections, onDisconnect);
      handleConnectionChange(_connections, prevConnections.current(), onConnect);
    }

    prevConnections.current = () => connections() ?? new ReactiveMap<string, HandleConnection>();
  });

  return () => Array.from(connections()?.values() ?? []);
}

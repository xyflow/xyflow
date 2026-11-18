import { useEffect, useRef } from 'react';
import {
  areConnectionMapsEqual,
  errorMessages,
  getConnectionLookupKey,
  handleConnectionChange,
  type NodeConnection,
  type UseNodeConnectionsParams,
} from '@xyflow/system';

import { useEqualSelector, useEdgesStore } from './useReactFlowStore';
import { useNodeId } from '../contexts/NodeIdContext';
import { type EdgesStore } from '../types';

const error014 = errorMessages['error014']();

/**
 * This hook returns an array of connections on a specific node, handle type ('source', 'target') or handle ID.
 *
 * @public
 * @returns An array with connections.
 *
 * @example
 * ```jsx
 *import { useNodeConnections } from '@xyflow/react';
 *
 *export default function () {
 *  const connections = useNodeConnections({
 *    handleType: 'target',
 *    handleId: 'my-handle',
 *  });
 *
 *  return (
 *    <div>There are currently {connections.length} incoming connections!</div>
 *  );
 *}
 *```
 */
export function useNodeConnections({
  id,
  handleType,
  handleId,
  onConnect,
  onDisconnect,
}: UseNodeConnectionsParams = {}): NodeConnection[] {
  const nodeId = useNodeId();
  const currentNodeId = id ?? nodeId;

  if (!currentNodeId) {
    throw new Error(error014);
  }

  const lookupKey = getConnectionLookupKey(currentNodeId, handleType, handleId);
  const prevConnections = useRef<Map<string, NodeConnection> | null>(null);
  const prevLookupKey = useRef(lookupKey);

  const selector = (state: EdgesStore) => {
    return state.connectionLookup.get(lookupKey);
  };

  const connections = useEdgesStore(useEqualSelector(selector, areConnectionMapsEqual));

  useEffect(() => {
    // @todo discuss if onConnect/onDisconnect should be called when the component mounts/unmounts
    // switching to another node or handle is not a connection change, so the callbacks are not called then either
    if (prevConnections.current && prevLookupKey.current === lookupKey && prevConnections.current !== connections) {
      const _connections = connections ?? new Map<string, NodeConnection>();
      handleConnectionChange(prevConnections.current, _connections, onDisconnect);
      handleConnectionChange(_connections, prevConnections.current, onConnect);
    }

    prevConnections.current = connections ?? new Map<string, NodeConnection>();
    prevLookupKey.current = lookupKey;
  }, [connections, lookupKey, onConnect, onDisconnect]);

  return Array.from(connections?.values() ?? []);
}

import { createEffect, createMemo } from 'solid-js';
import { Connection, NodeConnection, HandleType, handleConnectionChange, errorMessages } from '@xyflow/system';

import { useStore } from './useStore';
import { useNodeId } from '../contexts/NodeIdContext';
import { useRef } from '../utils/hooks';
import { ReactiveMap } from '@solid-primitives/map';

const error014 = errorMessages['error014']();

type UseNodeConnectionsParams = {
  /** ID of the node, filled in automatically if used inside custom node. */
  id?: string;
  /** What type of handle connections do you want to observe? */
  handleType?: HandleType;
  /** Filter by handle id (this is only needed if the node has multiple handles of the same type). */
  handleId?: string;
  /** Gets called when a connection is established. */
  onConnect?: (connections: Connection[]) => void;
  /** Gets called when a connection is removed. */
  onDisconnect?: (connections: Connection[]) => void;
};

/**
 * This hook returns an array of connections on a specific node, handle type ('source', 'target') or handle ID.
 *
 * @public
 * @returns An accessor function that returns an array with connections.
 *
 * @example
 * ```jsx
 *import { useNodeConnections } from '@xyflow/solid';
 *
 *export default function () {
 *  const connections = useNodeConnections({
 *    handleType: 'target',
 *    handleId: 'my-handle',
 *  });
 *
 *  return (
 *    <div>There are currently {connections().length} incoming connections!</div>
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
}: UseNodeConnectionsParams = {}) {
  const nodeId = useNodeId();
  const currentNodeId = id ?? nodeId();

  if (!currentNodeId) {
    throw new Error(error014);
  }

  const prevConnections = useRef<(() => Map<string, NodeConnection>) | null>(null);

  const connections = useStore(
    (state) => () =>
      state.connectionLookup.get(
        `${currentNodeId}${handleType ? (handleId ? `-${handleType}-${handleId}` : `-${handleType}`) : ''}`
      )
  );

  createEffect(() => {
    // @todo discuss if onConnect/onDisconnect should be called when the component mounts/unmounts
    if (prevConnections.current && prevConnections.current() !== connections()) {
      const _connections = connections() ?? new ReactiveMap<string, NodeConnection>();
      handleConnectionChange(prevConnections.current(), _connections, onDisconnect);
      handleConnectionChange(_connections, prevConnections.current(), onConnect);
    }

    prevConnections.current = () => connections() ?? new ReactiveMap<string, NodeConnection>();
  });

  return createMemo(() => Array.from(connections()?.values() ?? []));
}

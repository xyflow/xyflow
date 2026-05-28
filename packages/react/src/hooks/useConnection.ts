import { type ConnectionState, pointToRendererPoint } from '@xyflow/system';

import { useStore, useShallow } from './useStore';
import type { InternalNode, Node, ReactFlowStore } from '../types';

function connectionStoreSelector(s: ReactFlowStore) {
  return s.connection;
}

function toSelector(s: ReactFlowStore) {
  return s.connection.inProgress ? pointToRendererPoint(s.connection.to, s.transform) : undefined;
}
/**
 * The `useConnection` hook returns the current connection when there is an active
 * connection interaction. If no connection interaction is active, it returns null
 * for every property. A typical use case for this hook is to colorize handles
 * based on a certain condition (e.g. if the connection is valid or not).
 *
 * @public
 * @param connectionSelector - An optional selector function used to extract a slice of the
 * `ConnectionState` data. Using a selector can prevent component re-renders where data you don't
 * otherwise care about might change. If a selector is not provided, the entire `ConnectionState`
 * object is returned unchanged.
 * @example
 *
 * ```tsx
 *import { useConnection } from '@xyflow/react';
 *
 *function App() {
 *  const connection = useConnection();
 *
 *  return (
 *    <div> {connection ? `Someone is trying to make a connection from ${connection.fromNode} to this one.` : 'There are currently no incoming connections!'}
 *
 *   </div>
 *   );
 * }
 * ```
 *
 * @returns ConnectionState
 */
export function useConnection<NodeType extends Node = Node, SelectorReturn = ConnectionState<InternalNode<NodeType>>>(
  connectionSelector?: (connection: ConnectionState<InternalNode<NodeType>>) => SelectorReturn
): SelectorReturn {
  const connectionStore = useStore(useShallow(connectionStoreSelector));
  const to = useStore(useShallow(toSelector));

  const connection = { ...connectionStore, to } as ConnectionState<InternalNode<NodeType>>;

  return connectionSelector ? connectionSelector(connection) : (connection as SelectorReturn);
}

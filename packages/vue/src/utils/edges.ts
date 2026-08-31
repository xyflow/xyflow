import type { AddEdgeOptions, Connection, EdgeBase, ReconnectEdgeOptions } from '@xyflow/system';
import { addEdge as addEdgeSystem, reconnectEdge as reconnectEdgeSystem } from '@xyflow/system';
import { devWarn } from './log';

/**
 * Adds a `Connection` (or a full `Edge`) to an edges array and returns a new array — generating the
 * edge id and skipping the add when an equivalent connection already exists. The pure helper to use
 * in an `@connect` handler against a `v-model:edges` array, e.g.
 * `edges.value = addEdge(connection, edges.value)`, with no store/instance access.
 */
export function addEdge<EdgeType extends EdgeBase>(
  edgeParams: EdgeType | Connection,
  edges: EdgeType[],
  options: AddEdgeOptions = {},
): EdgeType[] {
  return addEdgeSystem(edgeParams, edges, {
    ...options,
    onError: options.onError ?? devWarn,
  });
}

/**
 * Reconnects an existing edge to a new `Connection`, returning a new edges array. The pure,
 * controlled counterpart to the store action `useVueFlow().reconnectEdge` — use it in an
 * `@reconnect` handler against a `v-model:edges` array, e.g.
 * `edges.value = reconnectEdge(oldEdge, newConnection, edges.value)`.
 */
export function reconnectEdge<EdgeType extends EdgeBase>(
  oldEdge: EdgeType,
  newConnection: Connection,
  edges: EdgeType[],
  options: ReconnectEdgeOptions = { shouldReplaceId: true },
): EdgeType[] {
  return reconnectEdgeSystem(oldEdge, newConnection, edges, {
    ...options,
    onError: options.onError ?? devWarn,
  });
}

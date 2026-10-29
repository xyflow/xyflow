import type { AddEdgeOptions, Connection, EdgeBase, ReconnectEdgeOptions } from '@xyflow/system';
import { addEdge as addEdgeSystem, reconnectEdge as reconnectEdgeSystem } from '@xyflow/system';
import { devWarn } from './log';

/**
 * Adds a `Connection` (or a full `Edge`) to an edges array and returns a new array — generating the
 * edge id and skipping the add when an equivalent connection already exists. The pure helper to use
 * in an `@connect` handler against a `v-model:edges` array, e.g.
 * `edges.value = addEdge(connection, edges.value)`, with no store/instance access.
 */
export function addEdge<EdgeType extends EdgeBase, Edges extends readonly EdgeType[] = EdgeType[]>(
  edgeParams: EdgeType | Connection,
  edges: Edges,
  options: AddEdgeOptions = {},
): Edges {
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
export function reconnectEdge<EdgeType extends EdgeBase, Edges extends readonly EdgeType[] = EdgeType[]>(
  oldEdge: EdgeType,
  newConnection: Connection,
  edges: Edges,
  options: ReconnectEdgeOptions = { shouldReplaceId: true },
): Edges {
  return reconnectEdgeSystem(oldEdge, newConnection, edges, {
    ...options,
    onError: options.onError ?? devWarn,
  });
}

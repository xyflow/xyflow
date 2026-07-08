import type { AddEdgeOptions, Connection, EdgeBase, ReconnectEdgeOptions } from '@xyflow/system';
import { addEdge as addEdgeSystem, createDevWarn, reconnectEdge as reconnectEdgeSystem } from '@xyflow/system';

const defaultOnError = createDevWarn('Vue Flow', 'https://vueflow.dev/');

/**
 * Adds a `Connection` (or a full `Edge`) to an edges array and returns a new array — generating the
 * edge id and skipping the add when an equivalent connection already exists. The pure helper to use
 * in an `@connect` handler against a `v-model:edges` array, e.g.
 * `edges.value = addEdge(connection, edges.value)`, with no store/instance access.
 *
 * Mirrors xyflow/react's + xyflow/svelte's `addEdge`.
 */
export function addEdge<EdgeType extends EdgeBase>(
  edgeParams: EdgeType | Connection,
  edges: EdgeType[],
  options: AddEdgeOptions = {},
): EdgeType[] {
  return addEdgeSystem(edgeParams, edges, {
    ...options,
    onError: options.onError ?? defaultOnError,
  });
}

/**
 * Reconnects an existing edge to a new `Connection`, returning a new edges array. The pure,
 * controlled counterpart to the store action `useVueFlow().reconnectEdge` — use it in an
 * `@reconnect` handler against a `v-model:edges` array, e.g.
 * `edges.value = reconnectEdge(oldEdge, newConnection, edges.value)`.
 *
 * Mirrors xyflow/react's `reconnectEdge`.
 */
export function reconnectEdge<EdgeType extends EdgeBase>(
  oldEdge: EdgeType,
  newConnection: Connection,
  edges: EdgeType[],
  options: ReconnectEdgeOptions = { shouldReplaceId: true },
): EdgeType[] {
  return reconnectEdgeSystem(oldEdge, newConnection, edges, {
    ...options,
    onError: options.onError ?? defaultOnError,
  });
}

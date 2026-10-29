import {
  addEdge as addEdgeSystem,
  reconnectEdge as reconnectEdgeSystem,
  createDevWarn,
  type AddEdgeOptions,
  type Connection,
  type EdgeBase,
  type ReconnectEdgeOptions,
  type OnError,
} from '@xyflow/system';

const defaultOnError = createDevWarn('React Flow', 'https://reactflow.dev/');

export function addEdge<EdgeType extends EdgeBase, Edges extends readonly EdgeType[] = EdgeType[]>(
  edgeParams: EdgeType | Connection,
  edges: Edges,
  options: AddEdgeOptions = {}
): Edges {
  return addEdgeSystem(edgeParams, edges, {
    ...options,
    onError: (options.onError as OnError) ?? defaultOnError,
  });
}

export function reconnectEdge<EdgeType extends EdgeBase, Edges extends readonly EdgeType[] = EdgeType[]>(
  oldEdge: EdgeType,
  newConnection: Connection,
  edges: Edges,
  options: ReconnectEdgeOptions = { shouldReplaceId: true }
): Edges {
  return reconnectEdgeSystem(oldEdge, newConnection, edges, {
    ...options,
    onError: (options.onError as OnError) ?? defaultOnError,
  });
}

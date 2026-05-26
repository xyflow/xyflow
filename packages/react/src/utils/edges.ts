import {
  addEdge as addEdgeSystem,
  reconnectEdge as reconnectEdgeSystem,
  createDevWarn,
  type AddEdgeOptions,
  type Connection,
  type EdgeBase,
  type ReconnectEdgeOptions,
} from '@xyflow/system';

const defaultOnError = createDevWarn('React Flow', 'https://reactflow.dev/');

export function addEdge<EdgeType extends EdgeBase>(
  edgeParams: EdgeType | Connection,
  edges: EdgeType[],
  options: AddEdgeOptions = {}
): EdgeType[] {
  return addEdgeSystem(edgeParams, edges, {
    ...options,
    onError: options.onError ?? defaultOnError,
  });
}

export function reconnectEdge<EdgeType extends EdgeBase>(
  oldEdge: EdgeType,
  newConnection: Connection,
  edges: EdgeType[],
  options: ReconnectEdgeOptions = { shouldReplaceId: true }
): EdgeType[] {
  return reconnectEdgeSystem(oldEdge, newConnection, edges, {
    ...options,
    onError: options.onError ?? defaultOnError,
  });
}

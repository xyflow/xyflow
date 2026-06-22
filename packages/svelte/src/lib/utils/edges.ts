import {
  addEdge as addEdgeSystem,
  createDevWarn,
  type AddEdgeOptions,
  type Connection,
  type EdgeBase,
} from '@xyflow/system';

const defaultOnError = createDevWarn('Svelte Flow', 'https://svelteflow.dev/');

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

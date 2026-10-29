import {
  addEdge as addEdgeSystem,
  createDevWarn,
  type AddEdgeOptions,
  type Connection,
  type EdgeBase
} from '@xyflow/system';

const defaultOnError = createDevWarn('Svelte Flow', 'https://svelteflow.dev/');

export function addEdge<EdgeType extends EdgeBase, Edges extends readonly EdgeType[] = EdgeType[]>(
  edgeParams: EdgeType | Connection,
  edges: Edges,
  options: AddEdgeOptions = {}
): Edges {
  return addEdgeSystem(edgeParams, edges, {
    ...options,
    onError: options.onError ?? defaultOnError
  });
}

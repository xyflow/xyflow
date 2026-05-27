import {
  addEdge as addEdgeSystem,
  type AddEdgeOptions,
  type Connection,
  type EdgeBase,
} from '@xyflow/system';

import { defaultOnError } from '$lib/errors';

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

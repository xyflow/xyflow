import type { DefaultEdgeOptions, Edge, EdgeEvents, Node } from '$lib/types';

export type EdgeRendererProps = {
  edges: readonly Edge[];
  nodes: readonly Node[];
  defaultEdgeOptions: DefaultEdgeOptions | undefined;
} & EdgeEvents;

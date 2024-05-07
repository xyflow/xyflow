import type { DefaultEdgeOptions, Edge, EdgeEvents } from '$lib/types';

export type EdgeRendererProps = {
  edges: Edge[];
  defaultEdgeOptions: DefaultEdgeOptions | undefined;
} & EdgeEvents;

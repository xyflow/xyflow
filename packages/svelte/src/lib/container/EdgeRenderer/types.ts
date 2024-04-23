import type { DefaultEdgeOptions, EdgeEvents } from '$lib/types';

export type EdgeRendererProps = {
  defaultEdgeOptions: DefaultEdgeOptions | undefined;
} & EdgeEvents;

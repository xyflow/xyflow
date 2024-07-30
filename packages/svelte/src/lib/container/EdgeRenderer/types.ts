import type { DefaultEdgeOptions, Edge, EdgeEvents, Node } from '$lib/types';
import type { Writable } from 'svelte/store';

export type EdgeRendererProps = {
  edges: Writable<Edge[]>;
  nodes: Writable<Node[]>;
  defaultEdgeOptions: DefaultEdgeOptions | undefined;
} & EdgeEvents;

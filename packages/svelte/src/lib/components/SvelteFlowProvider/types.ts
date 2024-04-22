import type { Edge, Node } from '$lib/types';
import type { Snippet } from 'svelte';

export type SvelteFlowProviderProps = {
  children?: Snippet;
  initialNodes?: Node[];
  initialEdges?: Edge[];
  initialWidth?: number;
  initialHeight?: number;
  fitView?: boolean;
};

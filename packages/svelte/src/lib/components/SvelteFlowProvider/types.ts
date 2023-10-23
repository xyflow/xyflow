import type { Edge, Node } from '$lib/types';

export type SvelteFlowProviderProps = {
  initialNodes?: Node[];
  initialEdges?: Edge[];
  initialWidth?: number;
  initialHeight?: number;
  fitView?: boolean;
};

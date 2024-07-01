import type { Edge, Node } from '$lib/types';
import type { NodeOrigin } from '@xyflow/system';

export type SvelteFlowProviderProps = {
  initialNodes?: Node[];
  initialEdges?: Edge[];
  initialWidth?: number;
  initialHeight?: number;
  fitView?: boolean;
  nodeOrigin?: NodeOrigin;
};

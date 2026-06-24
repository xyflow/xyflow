import type { Edge } from '@xyflow/vue';

export interface ProcessEdgeData extends Record<string, unknown> {
  isAnimating?: boolean;
}

export type ProcessEdge = Edge<ProcessEdgeData, 'process'>;

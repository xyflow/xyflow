import type { EdgeProps } from '$lib/types';

export type BaseEdgeProps = Pick<EdgeProps, 'interactionWidth' | 'label' | 'style'> & {
  id?: string;
  path: string;
  labelX?: number;
  labelY?: number;
  markerStart?: string;
  markerEnd?: string;
};

import type { EdgeProps } from '$lib/types';

export type BaseEdgeProps = Pick<
  EdgeProps,
  'interactionWidth' | 'label' | 'labelStyle' | 'style'
> & {
  id?: string;
  path: string;
  labelX?: number;
  labelY?: number;
  markerStart?: string;
  markerEnd?: string;
  class?: string;
};

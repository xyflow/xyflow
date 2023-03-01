import type { EdgeProps } from '$lib/types';

export type BaseEdgeProps = Pick<EdgeProps, 'interactionWidth' | 'label'> & {
  path: string;
  labelX?: number;
  labelY?: number;
};

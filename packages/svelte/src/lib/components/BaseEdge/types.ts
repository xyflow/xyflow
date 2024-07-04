import type { EdgeProps } from '$lib/types';

export type BaseEdgeProps = Pick<
  EdgeProps,
  'interactionWidth' | 'label' | 'labelStyle' | 'style'
> & {
  id?: string;
  /** SVG path of the edge */
  path: string;
  /** The x coordinate of the label */
  labelX?: number;
  /** The y coordinate of the label */
  labelY?: number;
  /** Marker at start of edge
   * @example 'url(#arrow)'
   */
  markerStart?: string;
  /** Marker at end of edge
   * @example 'url(#arrow)'
   */
  markerEnd?: string;
  class?: string;
};

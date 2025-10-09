import type { HTMLAttributes } from 'react';
import type { Position, Align } from '@xyflow/system';

/**
 * @expand
 */
export type EdgeToolbarProps = HTMLAttributes<HTMLDivElement> & {
  /**
   * By passing in an array of edge id's you can render a single tooltip for a group or collection
   * of edges.
   */
  edgeId?: string;
  /** If `true`, edge toolbar is visible even if edge is not selected. */
  isVisible?: boolean;
  /**
   * TODO: What and how?? Needed?
   * Position of the toolbar relative to the edge.
   * @default Position.Top
   * @example Position.TopLeft, Position.TopRight, Position.BottomLeft, Position.BottomRight
   */
  position?: Position;
  /**
   * The space between the edge and the toolbar, measured in pixels.
   * @default 10
   */
  offset?: number;
  /**
   * Align the toolbar relative to the edge.
   * @default "center"
   * @example Align.Start, Align.Center, Align.End
   */
  align?: Align;
  /**
   * The `x` position of the edge label.
   */
  labelX: number;
  /**
   * The `y` position of the edge label.
   */
  labelY: number;
};

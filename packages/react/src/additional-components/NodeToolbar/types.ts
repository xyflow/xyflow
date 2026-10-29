import type { HTMLAttributes } from 'react';
import type { Position, Align } from '@xyflow/system';

/**
 * @expand
 */
export type NodeToolbarProps = HTMLAttributes<HTMLDivElement> & {
  /**
   * By passing in an array of node id's you can render a single tooltip for a group or collection
   * of nodes.
   */
  nodeId?: string | string[];
  /** If `true`, node toolbar is visible even if node is not selected. */
  isVisible?: boolean;
  /**
   * Position of the toolbar relative to the node.
   * @default Position.Top
   * @example Position.TopLeft, Position.TopRight, Position.BottomLeft, Position.BottomRight
   */
  position?: Position;
  /**
   * The space between the node and the toolbar, measured in pixels.
   * @default 10
   */
  offset?: number;
  /**
   * Align the toolbar relative to the node.
   * @default "center"
   * @example Align.Start, Align.Center, Align.End
   */
  align?: Align;
};

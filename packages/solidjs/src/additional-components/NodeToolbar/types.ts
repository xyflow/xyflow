// import type { HTMLAttributes } from 'react';
import type { Position, Align } from '@xyflow/system';
import { JSX } from 'solid-js';

export type NodeToolbarProps = JSX.HTMLAttributes<HTMLDivElement> & {
  /** Id of the node, or array of ids the toolbar should be displayed at */
  nodeId?: string | string[];
  /** If true, node toolbar is visible even if node is not selected */
  isVisible?: boolean;
  /** Position of the toolbar relative to the node
   * @example Position.TopLeft, Position.TopRight,
   * Position.BottomLeft, Position.BottomRight
   */
  position?: Position;
  /** Offset the toolbar from the node */
  offset?: number;
  /** Align the toolbar relative to the node
   * @example Align.Start, Align.Center, Align.End
   */
  align?: Align;
};

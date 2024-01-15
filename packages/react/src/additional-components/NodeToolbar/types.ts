import type { HTMLAttributes } from 'react';
import type { Position, Align } from '@xyflow/system';

export type NodeToolbarProps = HTMLAttributes<HTMLDivElement> & {
  /** id of the node, or array of ids the toolbar should be displayed at */
  nodeId?: string | string[];
  isVisible?: boolean;
  /** position of the toolbar relative to the node
   * @example Position.TopLeft, Position.TopRight,
   * Position.BottomLeft, Position.BottomRight
   */
  position?: Position;
  /** offset the toolbar from the node */
  offset?: number;
  /** align the toolbar relative to the node
   * @example Align.Start, Align.Center, Align.End
   */
  align?: Align;
};

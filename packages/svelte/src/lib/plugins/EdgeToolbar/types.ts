import type { Position, Align } from '@xyflow/system';
import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export type EdgeToolbarProps = {
  /**
   * An edge toolbar must be attached to an edge.
   */
  edgeId: string;
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
   * Align the toolbar relative to the edge.
   * @default "center"
   * @example Align.Start, Align.Center, Align.End
   */
  align?: Align;
  /**
   * The `x` position of the edge label.
   */
  x: number;
  /**
   * The `y` position of the edge label.
   */
  y: number;
  /**
   * The `offsetX` position of the edge label relative to the edge in pixels.
   */
  offsetX?: number;
  /**
   * The `offsetY` position of the edge label relative to the edge in pixels.
   */
  offsetY?: number;
  children?: Snippet;
} & HTMLAttributes<HTMLDivElement>;

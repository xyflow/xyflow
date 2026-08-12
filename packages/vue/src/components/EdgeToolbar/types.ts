export interface EdgeToolbarProps {
  /** The id of the edge the toolbar belongs to. */
  edgeId: string;
  /** X position of the toolbar in flow coordinates — typically the edge's label x. */
  x: number;
  /** Y position of the toolbar in flow coordinates — typically the edge's label y. */
  y: number;
  /**
   * Force the toolbar's visibility. When left unset, the toolbar is shown only while its edge is selected.
   */
  isVisible?: boolean;
  /**
   * Horizontal alignment of the toolbar relative to its `x` position.
   *
   * @default 'center'
   */
  alignX?: 'left' | 'center' | 'right';
  /**
   * Vertical alignment of the toolbar relative to its `y` position.
   *
   * @default 'center'
   */
  alignY?: 'top' | 'center' | 'bottom';
}

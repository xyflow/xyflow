import type { Position } from '@xyflow/system';

export interface NodeToolbarProps {
  /**
   * The id of the node (or nodes) the toolbar is attached to. Defaults to the node the toolbar is rendered
   * in, so you usually only set this to control a toolbar from outside its node.
   */
  nodeId?: string | string[];
  /**
   * Force the toolbar's visibility. When left unset, the toolbar is shown only while its node is selected
   * (and hidden when several nodes are selected).
   */
  isVisible?: boolean;
  /**
   * Which side of the node the toolbar is placed on, see {@link Position}.
   *
   * @default Position.Top
   */
  position?: Position;
  /**
   * Distance between the toolbar and the node, in pixels.
   *
   * @default 10
   */
  offset?: number;
  /**
   * Alignment of the toolbar along the chosen side.
   *
   * @default 'center'
   */
  align?: 'center' | 'start' | 'end';
}

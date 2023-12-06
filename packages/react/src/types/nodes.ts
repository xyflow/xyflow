import type { CSSProperties, MouseEvent as ReactMouseEvent } from 'react';
import type { NodeBase, XYPosition } from '@xyflow/system';

/**
 * The node data structure that gets used for the nodes prop.
 * @public
 */
export type Node<NodeData = any, NodeType extends string | undefined = string | undefined> = NodeBase<
  NodeData,
  NodeType
> & {
  /**
   * Inline style object
   */
  style?: CSSProperties;
  /**
   * Inline style object
   */
  className?: string;
  /**
   * Inline style object
   */
  resizing?: boolean;
};

export type NodeMouseHandler = (event: ReactMouseEvent, node: Node) => void;
export type NodeDragHandler = (event: ReactMouseEvent, node: Node, nodes: Node[]) => void;
export type SelectionDragHandler = (event: ReactMouseEvent, nodes: Node[]) => void;

export type WrapNodeProps<NodeData = any> = Pick<
  Node<NodeData>,
  'id' | 'data' | 'style' | 'className' | 'dragHandle' | 'sourcePosition' | 'targetPosition' | 'hidden' | 'ariaLabel'
> & {
  type: string;
  selected: boolean;
  zIndex: number;
  isConnectable: boolean;
  xPos: number;
  yPos: number;
  xPosOrigin: number;
  yPosOrigin: number;
  positionAbsolute: XYPosition;
  initialized: boolean;
  isSelectable: boolean;
  isDraggable: boolean;
  isFocusable: boolean;
  onClick?: NodeMouseHandler;
  onDoubleClick?: NodeMouseHandler;
  onMouseEnter?: NodeMouseHandler;
  onMouseMove?: NodeMouseHandler;
  onMouseLeave?: NodeMouseHandler;
  onContextMenu?: NodeMouseHandler;
  resizeObserver: ResizeObserver | null;
  isParent: boolean;
  noDragClassName: string;
  noPanClassName: string;
  rfId: string;
  disableKeyboardA11y: boolean;
  width?: number;
  height?: number;
};

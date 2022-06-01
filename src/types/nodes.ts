import { CSSProperties, MouseEvent as ReactMouseEvent } from 'react';

import { XYPosition, Position, CoordinateExtent } from './utils';
import { HandleElement } from './handles';
import { internalsSymbol } from '../utils';

// interface for the user node items
export interface Node<T = any> {
  id: string;
  position: XYPosition;
  data: T;
  type?: string;
  style?: CSSProperties;
  className?: string;
  targetPosition?: Position;
  sourcePosition?: Position;
  hidden?: boolean;
  selected?: boolean;
  dragging?: boolean;
  draggable?: boolean;
  selectable?: boolean;
  connectable?: boolean;
  dragHandle?: string;
  width?: number | null;
  height?: number | null;
  parentNode?: string;
  zIndex?: number;
  extent?: 'parent' | CoordinateExtent;
  expandParent?: boolean;
  positionAbsolute?: XYPosition;

  // only used internally
  [internalsSymbol]?: {
    z?: number;
    handleBounds?: NodeHandleBounds;
    isParent?: boolean;
  };
}

// props that get passed to a custom node
export interface NodeProps<T = any> {
  id: string;
  type: string;
  data: T;
  selected: boolean;
  isConnectable: boolean;
  xPos: number;
  yPos: number;
  dragging: boolean;
  zIndex: number;
  targetPosition?: Position;
  sourcePosition?: Position;
  dragHandle?: string;
}

export type NodeMouseHandler = (event: ReactMouseEvent, node: Node) => void;
export type NodeDragHandler = (event: ReactMouseEvent, node: Node, nodes: Node[]) => void;

export interface WrapNodeProps<T = any> {
  id: string;
  type: string;
  data: T;
  selected: boolean;
  isConnectable: boolean;
  xPos: number;
  yPos: number;
  width?: number | null;
  height?: number | null;
  isSelectable: boolean;
  isDraggable: boolean;
  selectNodesOnDrag: boolean;
  onClick?: NodeMouseHandler;
  onDoubleClick?: NodeMouseHandler;
  onMouseEnter?: NodeMouseHandler;
  onMouseMove?: NodeMouseHandler;
  onMouseLeave?: NodeMouseHandler;
  onContextMenu?: NodeMouseHandler;
  onDragStart?: NodeDragHandler;
  onDrag?: NodeDragHandler;
  onDragStop?: NodeDragHandler;
  style?: CSSProperties;
  className?: string;
  sourcePosition: Position;
  targetPosition: Position;
  hidden?: boolean;
  resizeObserver: ResizeObserver | null;
  dragHandle?: string;
  zIndex: number;
  isParent: boolean;
  noPanClassName: string;
  noDragClassName: string;
}

export type NodeHandleBounds = {
  source: HandleElement[] | null;
  target: HandleElement[] | null;
};

export type NodeDimensionUpdate = {
  id: string;
  nodeElement: HTMLDivElement;
  forceUpdate?: boolean;
};

export type NodeInternals = Map<string, Node>;

export type NodeBounds = XYPosition & {
  width: number | null;
  height: number | null;
};

export type NodeDragItem = {
  id: string;
  // relative node position
  position: XYPosition;
  // distance from the mouse cursor to the node when start dragging
  distance: XYPosition;
  width?: number | null;
  height?: number | null;
  extent?: 'parent' | CoordinateExtent;
  parentNode?: string;
  dragging?: boolean;
};

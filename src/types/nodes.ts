import { CSSProperties, MouseEvent as ReactMouseEvent } from 'react';

import { SnapGrid } from './general';
import { XYPosition, Position, CoordinateExtent } from './utils';
import { HandleElement } from './handles';

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

  // only used internally
  positionAbsolute?: XYPosition;
  z?: number;
  handleBounds?: NodeHandleBounds;
  isParent?: boolean;
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

export interface WrapNodeProps<T = any> {
  id: string;
  type: string;
  data: T;
  selected: boolean;
  isConnectable: boolean;
  scale: number;
  xPos: number;
  yPos: number;
  width?: number | null;
  height?: number | null;
  isSelectable: boolean;
  isDraggable: boolean;
  selectNodesOnDrag: boolean;
  onClick?: NodeMouseHandler;
  onNodeDoubleClick?: NodeMouseHandler;
  onMouseEnter?: NodeMouseHandler;
  onMouseMove?: NodeMouseHandler;
  onMouseLeave?: NodeMouseHandler;
  onContextMenu?: NodeMouseHandler;
  onNodeDragStart?: NodeMouseHandler;
  onNodeDrag?: NodeMouseHandler;
  onNodeDragStop?: NodeMouseHandler;
  style?: CSSProperties;
  className?: string;
  sourcePosition: Position;
  targetPosition: Position;
  hidden?: boolean;
  snapToGrid?: boolean;
  snapGrid?: SnapGrid;
  dragging: boolean;
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

export type NodeDiffUpdate = {
  id?: string;
  diff?: XYPosition;
  dragging?: boolean;
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

/* eslint-disable @typescript-eslint/no-explicit-any */
import { internalsSymbol } from '../constants';
import type { XYPosition, Position, CoordinateExtent, HandleElement } from '.';
import { Optional } from '../utils/types';

// this is stuff that all nodes share independent of the framework
export type NodeBase<T = any, U extends string | undefined = string | undefined> = {
  id: string;
  position: XYPosition;
  data: T;
  type?: U;
  sourcePosition?: Position;
  targetPosition?: Position;
  hidden?: boolean;
  selected?: boolean;
  dragging?: boolean;
  draggable?: boolean;
  selectable?: boolean;
  connectable?: boolean;
  deletable?: boolean;
  dragHandle?: string;
  width?: number;
  height?: number;
  measuredWidth?: number;
  measuredHeight?: number;
  parentNode?: string;
  zIndex?: number;
  extent?: 'parent' | CoordinateExtent;
  expandParent?: boolean;
  positionAbsolute?: XYPosition;
  ariaLabel?: string;
  focusable?: boolean;
  origin?: NodeOrigin;
  handles?: NodeHandle[];
  size?: {
    width: number;
    height: number;
  };

  // only used internally
  [internalsSymbol]?: {
    z?: number;
    handleBounds?: NodeHandleBounds;
    isParent?: boolean;
  };
};

// props that get passed to a custom node
export type NodeProps<T = any> = {
  id: NodeBase['id'];
  data: T;
  dragHandle: NodeBase['dragHandle'];
  type: NodeBase['type'];
  selected: NodeBase['selected'];
  isConnectable: NodeBase['connectable'];
  zIndex: NodeBase['zIndex'];
  xPos: number;
  yPos: number;
  dragging: boolean;
  targetPosition?: Position;
  sourcePosition?: Position;
};

export type NodeHandleBounds = {
  source: HandleElement[] | null;
  target: HandleElement[] | null;
};

export type NodeDimensionUpdate = {
  id: string;
  nodeElement: HTMLDivElement;
  forceUpdate?: boolean;
};

export type NodeBounds = XYPosition & {
  width: number | null;
  height: number | null;
};

export type NodeDragItem = {
  id: string;
  position: XYPosition;
  positionAbsolute: XYPosition;
  // distance from the mouse cursor to the node when start dragging
  distance: XYPosition;
  width?: number;
  height?: number;
  measuredWidth?: number;
  measuredHeight?: number;
  extent?: 'parent' | CoordinateExtent;
  parentNode?: string;
  dragging?: boolean;
  origin?: NodeOrigin;
  expandParent?: boolean;
};

export type NodeOrigin = [number, number];

export type OnNodeDrag = (event: MouseEvent, node: NodeBase, nodes: NodeBase[]) => void;

export type OnSelectionDrag = (event: MouseEvent, nodes: NodeBase[]) => void;

export type NodeHandle = Optional<HandleElement, 'width' | 'height'>;

/* eslint-disable @typescript-eslint/no-explicit-any */
import { internalsSymbol } from '../';
import type { XYPosition, Position, CoordinateExtent, HandleElement } from '.';

// this is stuff that all nodes share independent of the framework
export type BaseNode<T = any, U extends string | undefined = string | undefined> = {
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
  width?: number | null;
  height?: number | null;
  parentNode?: string;
  zIndex?: number;
  extent?: 'parent' | CoordinateExtent;
  expandParent?: boolean;
  positionAbsolute?: XYPosition;
  ariaLabel?: string;
  focusable?: boolean;
  origin?: NodeOrigin;

  // only used internally
  [internalsSymbol]?: {
    z?: number;
    handleBounds?: NodeHandleBounds;
    isParent?: boolean;
  };
};

// props that get passed to a custom node
export type NodeProps<T = any> = {
  id: BaseNode['id'];
  data: T;
  dragHandle: BaseNode['dragHandle'];
  type: BaseNode['type'];
  selected: BaseNode['selected'];
  isConnectable: BaseNode['connectable'];
  zIndex: BaseNode['zIndex'];
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
  width?: number | null;
  height?: number | null;
  extent?: 'parent' | CoordinateExtent;
  parentNode?: string;
  dragging?: boolean;
  origin?: NodeOrigin;
};

export type NodeOrigin = [number, number];

export type OnNodeDrag = (event: MouseEvent, node: BaseNode, nodes: BaseNode[]) => void;

export type OnSelectionDrag = (event: MouseEvent, nodes: BaseNode[]) => void;

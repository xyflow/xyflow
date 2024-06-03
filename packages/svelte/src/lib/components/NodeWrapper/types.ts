import type { InternalNode, Node } from '$lib/types';

export type NodeWrapperProps = Pick<
  Node,
  | 'id'
  | 'class'
  | 'connectable'
  | 'data'
  | 'draggable'
  | 'dragging'
  | 'selected'
  | 'selectable'
  | 'deletable'
  | 'style'
  | 'type'
  | 'sourcePosition'
  | 'targetPosition'
  | 'dragHandle'
  | 'hidden'
  | 'width'
  | 'height'
  | 'initialWidth'
  | 'initialHeight'
> & {
  measuredWidth?: number;
  measuredHeight?: number;
  type: string;
  positionX: number;
  positionY: number;
  positionOriginX: number;
  positionOriginY: number;
  'on:nodeclick'?: (event: MouseEvent) => void;
  resizeObserver?: ResizeObserver | null;
  isParent?: boolean;
  zIndex: number;
  node: InternalNode;
  initialized: boolean;
};

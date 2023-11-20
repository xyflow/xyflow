import type { Node } from '$lib/types';

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
  | 'style'
  | 'type'
  | 'width'
  | 'height'
  | 'sourcePosition'
  | 'targetPosition'
  | 'dragHandle'
  | 'hidden'
> & {
  positionX: number;
  positionY: number;
  positionOriginX: number;
  positionOriginY: number;
  'on:nodeclick'?: (event: MouseEvent) => void;
  resizeObserver?: ResizeObserver | null;
  isParent?: boolean;
  zIndex: number;
  node: Node;
  initialized: boolean;
  width?: number;
  height?: number;
};

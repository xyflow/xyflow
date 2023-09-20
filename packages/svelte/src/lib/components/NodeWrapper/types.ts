import type { XYPosition } from '@xyflow/system';
import type { Node } from '$lib/types';

export type NodeWrapperProps = Pick<
  Node,
  | 'id'
  | 'class'
  | 'connectable'
  | 'data'
  | 'draggable'
  | 'dragging'
  | 'positionAbsolute'
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
  positionOrigin?: XYPosition;
  'on:nodeclick'?: (event: MouseEvent) => void;
  resizeObserver?: ResizeObserver | null;
  isParent?: boolean;
  zIndex: number;
  node: Node;
};

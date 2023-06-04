import type { XYPosition } from '@reactflow/system';
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
> & {
  positionOrigin?: XYPosition;
  'on:nodeclick'?: (event: MouseEvent) => void;
  resizeObserver?: ResizeObserver | null;
  isParent?: boolean;
};

import type { SvelteFlowStore } from '$lib/store/types';
import type { InternalNode, Node } from '$lib/types';

export type ConnectableContext = {
  value: boolean;
};

export type NodeWrapperProps = {
  // Pick<
  //   Node,
  //   | 'id'
  //   | 'class'
  //   | 'connectable'
  //   | 'data'
  //   | 'draggable'
  //   | 'dragging'
  //   | 'selected'
  //   | 'selectable'
  //   | 'deletable'
  //   | 'style'
  //   | 'type'
  //   | 'sourcePosition'
  //   | 'targetPosition'
  //   | 'dragHandle'
  //   | 'hidden'
  //   | 'width'
  //   | 'height'
  //   | 'initialWidth'
  //   | 'initialHeight'
  //   | 'parentId'
  // > & {
  //   measuredWidth?: number;
  //   measuredHeight?: number;
  //   type: string;
  //   positionX: number;
  //   positionY: number;
  //   'on:nodeclick'?: (event: MouseEvent) => void;
  //   isParent?: boolean;
  //   zIndex: number;
  // initialized: boolean;
  node: Node;
  nodeClickDistance?: number;
  resizeObserver?: ResizeObserver | null;
  store: SvelteFlowStore;
};

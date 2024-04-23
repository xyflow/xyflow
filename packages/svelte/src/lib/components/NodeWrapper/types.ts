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
  type?: string;
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
};

// export type NodeWrapperEventCallbacks = {
//   onnodeclick: { node: Node; event: MouseEvent | TouchEvent };
//   onnodecontextmenu: { node: Node; event: MouseEvent | TouchEvent };
//   onnodedrag: { targetNode: Node | null; nodes: Node[]; event: MouseEvent | TouchEvent };
//   onnodedragstart: { targetNode: Node | null; nodes: Node[]; event: MouseEvent | TouchEvent };
//   onnodedragstop: { targetNode: Node | null; nodes: Node[]; event: MouseEvent | TouchEvent };
//   onnodemouseenter: { node: Node; event: MouseEvent | TouchEvent };
//   onnodemouseleave: { node: Node; event: MouseEvent | TouchEvent };
//   nodemousemove: { node: Node; event: MouseEvent | TouchEvent };
// };

export type NodeWrapperEventCallbacks = {
  onnodeclick: ({ node, event }: { node: Node; event: MouseEvent | TouchEvent }) => void;
  onnodecontextmenu: ({ node, event }: { node: Node; event: MouseEvent | TouchEvent }) => void;
  onnodedrag: ({
    targetNode,
    nodes,
    event
  }: {
    targetNode: Node | null;
    nodes: Node[];
    event: MouseEvent | TouchEvent;
  }) => void;
  onnodedragstart: ({
    targetNode,
    nodes,
    event
  }: {
    targetNode: Node | null;
    nodes: Node[];
    event: MouseEvent | TouchEvent;
  }) => void;
  onnodedragstop: ({
    targetNode,
    nodes,
    event
  }: {
    targetNode: Node | null;
    nodes: Node[];
    event: MouseEvent | TouchEvent;
  }) => void;
  onnodemouseenter: ({ node, event }: { node: Node; event: MouseEvent | TouchEvent }) => void;
  onnodemouseleave: ({ node, event }: { node: Node; event: MouseEvent | TouchEvent }) => void;
  onnodemousemove: ({ node, event }: { node: Node; event: MouseEvent | TouchEvent }) => void;
};

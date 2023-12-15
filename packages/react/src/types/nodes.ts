import type { CSSProperties, MouseEvent as ReactMouseEvent } from 'react';
import type { CoordinateExtent, NodeBase, NodeOrigin, OnError } from '@xyflow/system';
import { NodeTypes } from './general';

export type Node<NodeData = any, NodeType extends string | undefined = string | undefined> = NodeBase<
  NodeData,
  NodeType
> & {
  style?: CSSProperties;
  className?: string;
  resizing?: boolean;
};

export type NodeMouseHandler = (event: ReactMouseEvent, node: Node) => void;
export type NodeDragHandler = (event: ReactMouseEvent, node: Node, nodes: Node[]) => void;
export type SelectionDragHandler = (event: ReactMouseEvent, nodes: Node[]) => void;

export type NodeWrapperProps = {
  id: string;
  nodesConnectable: boolean;
  elementsSelectable: boolean;
  nodesDraggable: boolean;
  nodesFocusable: boolean;
  onClick?: NodeMouseHandler;
  onDoubleClick?: NodeMouseHandler;
  onMouseEnter?: NodeMouseHandler;
  onMouseMove?: NodeMouseHandler;
  onMouseLeave?: NodeMouseHandler;
  onContextMenu?: NodeMouseHandler;
  resizeObserver: ResizeObserver | null;
  noDragClassName: string;
  noPanClassName: string;
  rfId: string;
  disableKeyboardA11y: boolean;
  nodeTypes: NodeTypes;
  nodeExtent?: CoordinateExtent;
  nodeOrigin: NodeOrigin;
  onError?: OnError;
};

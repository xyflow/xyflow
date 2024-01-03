import type { CSSProperties, MouseEvent as ReactMouseEvent } from 'react';
import type { CoordinateExtent, NodeBase, NodeOrigin, OnError } from '@xyflow/system';

import { NodeTypes } from './general';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
/**
 * The node data structure that gets used for the nodes prop.
 * @public
 */
export type Node<NodeData = any, NodeType extends string | undefined = string | undefined> = NodeBase<
  NodeData,
  NodeType
> & {
  style?: CSSProperties;
  className?: string;
  resizing?: boolean;
  focusable?: boolean;
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
  nodeTypes?: NodeTypes;
  nodeExtent?: CoordinateExtent;
  nodeOrigin: NodeOrigin;
  onError?: OnError;
};

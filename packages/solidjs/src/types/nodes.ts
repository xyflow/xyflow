// import type { CSSProperties, MouseEvent as ReactMouseEvent } from 'react';
import type {
  CoordinateExtent,
  NodeBase,
  NodeOrigin,
  OnError,
  NodeProps as NodePropsBase,
  InternalNodeBase,
} from '@xyflow/system';

import { NodeTypes } from './general';
import { JSX } from 'solid-js'

/**
 * The node data structure that gets used for the nodes prop.
 * @public
 */
export type Node<
  NodeData extends Record<string, unknown> = Record<string, unknown>,
  NodeType extends string = string
> = NodeBase<NodeData, NodeType> & {
  style?: JSX.CSSProperties;
  className?: string;
  resizing?: boolean;
  focusable?: boolean;
};

/**
 * The node data structure that gets used for internal nodes.
 * There are some data structures added under node.internal
 * that are needed for tracking some properties
 * @public
 */
export type InternalNode<NodeType extends Node = Node> = InternalNodeBase<NodeType>;

export type NodeMouseHandler<NodeType extends Node = Node> = (event: MouseEvent, node: NodeType) => void;
export type SelectionDragHandler<NodeType extends Node = Node> = (event: MouseEvent, nodes: NodeType[]) => void;
export type OnNodeDrag<NodeType extends Node = Node> = (
  event: MouseEvent,
  node: NodeType,
  nodes: NodeType[]
) => void;

export type NodeWrapperProps<NodeType extends Node> = {
  id: string;
  nodesConnectable: boolean;
  elementsSelectable: boolean;
  nodesDraggable: boolean;
  nodesFocusable: boolean;
  onClick?: NodeMouseHandler<NodeType>;
  onDoubleClick?: NodeMouseHandler<NodeType>;
  onMouseEnter?: NodeMouseHandler<NodeType>;
  onMouseMove?: NodeMouseHandler<NodeType>;
  onMouseLeave?: NodeMouseHandler<NodeType>;
  onContextMenu?: NodeMouseHandler<NodeType>;
  resizeObserver: ResizeObserver | null;
  noDragClassName?: string;
  noPanClassName: string;
  rfId: string;
  disableKeyboardA11y: boolean;
  nodeTypes?: NodeTypes;
  nodeExtent?: CoordinateExtent;
  nodeOrigin: NodeOrigin;
  onError?: OnError;
};

export type BuiltInNode = Node<{ label: string }, 'input' | 'output' | 'default'>;

export type NodeProps<NodeType extends Node = Node> = NodePropsBase<NodeType>;

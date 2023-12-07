/* eslint-disable @typescript-eslint/no-explicit-any */
import type { CSSProperties, ComponentType, MemoExoticComponent, MouseEvent as ReactMouseEvent } from 'react';
import type { NodeBase, NodeProps, XYPosition } from '@xyflow/system';

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
};

export type NodeMouseHandler = (event: ReactMouseEvent, node: Node) => void;
export type NodeDragHandler = (event: ReactMouseEvent, node: Node, nodes: Node[]) => void;
export type SelectionDragHandler = (event: ReactMouseEvent, nodes: Node[]) => void;

export type WrapNodeProps<NodeType extends Node = Node> = Pick<
  NodeType,
  'id' | 'data' | 'style' | 'className' | 'dragHandle' | 'sourcePosition' | 'targetPosition' | 'hidden' | 'ariaLabel'
> & {
  type: string;
  selected: boolean;
  zIndex: number;
  isConnectable: boolean;
  xPos: number;
  yPos: number;
  xPosOrigin: number;
  yPosOrigin: number;
  positionAbsolute: XYPosition;
  initialized: boolean;
  isSelectable: boolean;
  isDraggable: boolean;
  isFocusable: boolean;
  onClick?: NodeMouseHandler;
  onDoubleClick?: NodeMouseHandler;
  onMouseEnter?: NodeMouseHandler;
  onMouseMove?: NodeMouseHandler;
  onMouseLeave?: NodeMouseHandler;
  onContextMenu?: NodeMouseHandler;
  resizeObserver: ResizeObserver | null;
  isParent: boolean;
  noDragClassName: string;
  noPanClassName: string;
  rfId: string;
  disableKeyboardA11y: boolean;
  width?: number;
  height?: number;
};

export type NodeTypes = { [key: string]: ComponentType<NodeProps> };
export type NodeTypesWrapped = { [key: string]: MemoExoticComponent<ComponentType<WrapNodeProps>> };

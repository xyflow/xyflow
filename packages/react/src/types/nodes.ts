import type { CSSProperties, MouseEvent as ReactMouseEvent, AriaRole, HTMLAttributes, DOMAttributes } from 'react';
import type { CoordinateExtent, NodeBase, OnError, NodeProps as NodePropsBase, InternalNodeBase } from '@xyflow/system';

import { NodeTypes } from './general';

/**
 * The `Node` type represents everything React Flow needs to know about a given node.
 * Whenever you want to update a certain attribute of a node, you need to create a new
 * node object.
 *
 * @public
 */
export type Node<
  NodeData extends Record<string, unknown> = Record<string, unknown>,
  NodeType extends string | undefined = string | undefined
> = NodeBase<NodeData, NodeType> & {
  style?: CSSProperties;
  className?: string;
  resizing?: boolean;
  focusable?: boolean;
  /**
   * The ARIA role attribute for the node element, used for accessibility.
   * @default "group"
   */
  ariaRole?: AriaRole;

  /**
   * General escape hatch for adding custom attributes to the node's DOM element.
   */
  domAttributes?: Omit<
    HTMLAttributes<HTMLDivElement>,
    | 'id'
    | 'style'
    | 'className'
    | 'draggable'
    | 'role'
    | 'aria-label'
    | 'defaultValue'
    | 'dangerouslySetInnerHTML'
    | keyof DOMAttributes<HTMLDivElement>
  >;
};

/**
 * The `InternalNode` type is identical to the base [`Node`](/api-references/types/node)
 * type but is extended with some additional properties used internally.
 * Some functions and callbacks that return nodes may return an `InternalNode`.
 *
 * @public
 */
export type InternalNode<NodeType extends Node = Node> = InternalNodeBase<NodeType>;

export type NodeMouseHandler<NodeType extends Node = Node> = (event: ReactMouseEvent, node: NodeType) => void;
export type SelectionDragHandler<NodeType extends Node = Node> = (event: ReactMouseEvent, nodes: NodeType[]) => void;
export type OnNodeDrag<NodeType extends Node = Node> = (
  event: ReactMouseEvent,
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
  noDragClassName: string;
  noPanClassName: string;
  rfId: string;
  disableKeyboardA11y: boolean;
  nodeTypes?: NodeTypes;
  nodeExtent?: CoordinateExtent;
  onError?: OnError;
  nodeClickDistance?: number;
};

/**
 * The `BuiltInNode` type represents the built-in node types that are available in React Flow.
 * You can use this type to extend your custom node type if you still want ot use the built-in ones.
 *
 * @public
 * @example
 * ```ts
 * type CustomNode = Node<{ value: number }, 'custom'>;
 * type MyAppNode = CustomNode | BuiltInNode;
 * ```
 */
export type BuiltInNode =
  | Node<{ label: string }, 'input' | 'output' | 'default'>
  | Node<Record<string, never>, 'group'>;

/**
 * When you implement a [custom node](/learn/customization/custom-nodes) it is
 * wrapped in a component that enables basic functionality like selection and
 * dragging. Your custom node receives `NodeProps` as props.
 *
 * @public
 * @example
 * ```tsx
 *import { useState } from 'react';
 *import { NodeProps, Node } from '@xyflow/react';
 *
 *export type CounterNode = Node<{ initialCount?: number }, 'counter'>;
 *
 *export default function CounterNode(props: NodeProps<CounterNode>) {
 *  const [count, setCount] = useState(props.data?.initialCount ?? 0);
 *
 *  return (
 *    <div>
 *      <p>Count: {count}</p>
 *      <button className="nodrag" onClick={() => setCount(count + 1)}>
 *        Increment
 *      </button>
 *    </div>
 *  );
 *}
 *```
 */
export type NodeProps<NodeType extends Node = Node> = NodePropsBase<NodeType>;

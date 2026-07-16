import type { InternalNodeBase, NodeBase } from '@xyflow/system';
import type { HTMLAttributes } from 'vue';
import type { ClassValue, Styles } from './flow';

/**
 * The origin of a Node determines how it is placed relative to its own coordinates.
 * `[0, 0]` places it at the top left corner, `[0.5, 0.5]` right in the center and
 * `[1, 1]` at the bottom right of its position.
 *
 * Locally defined (not re-exported from `@xyflow/system`) so the Vue SFC compiler stays out of system's
 * d.ts (its `Optional<T, K>` trips vuejs/core#14236); structurally identical to system's.
 */
export type NodeOrigin = [number, number];

/**
 * The `Node` type represents everything Vue Flow needs to know about a given node. Whenever you want to
 * update a certain attribute of a node, you need to create a new node object.
 */
export type Node<
  NodeData extends Record<string, unknown> = Record<string, unknown>,
  NodeType extends string | undefined = string | undefined,
> = NodeBase<NodeData, NodeType> & {
  class?: ClassValue;
  style?: Styles;
  resizing?: boolean;
  focusable?: boolean;
  ariaRole?: string;
  domAttributes?: Omit<
    HTMLAttributes,
    | 'id'
    | 'style'
    | 'className'
    | 'draggable'
    | 'aria-label'
    | 'onMouseenter'
    | 'onMousemove'
    | 'onMouseleave'
    | 'onContextmenu'
    | 'onClick'
    | 'onDblclick'
    | 'onKeydown'
  >;
};
/**
 * The enriched, store-internal node — what `nodeLookup`/`getInternalNode(id)`/`useInternalNode(id)` return,
 * once a user-provided `Node` has been processed by the store. Carries the user `Node`
 * (`internals.userNode`) plus the store-computed `internals.{positionAbsolute, z, handleBounds}` and
 * authoritative `measured`.
 */
export type InternalNode<NodeType extends Node = Node> = InternalNodeBase<NodeType>;

/**
 * When you implement a custom node it is wrapped in a component that enables basic functionality like
 * selection and dragging. Your custom node receives `NodeProps` as props.
 */
export interface NodeProps<NodeType extends Node = Node> {
  id: string;
  data: NodeType['data'];
  type: NodeType['type'];
  selected: boolean;
  selectable: boolean;
  deletable: boolean;
  draggable: boolean;
  dragging: boolean;
  zIndex: number;
  /** Whether a node is connectable or not. */
  isConnectable: boolean;
  /** Position absolute x value. */
  positionAbsoluteX: number;
  /** Position absolute y value. */
  positionAbsoluteY: number;
  width?: NodeType['width'];
  height?: NodeType['height'];
  sourcePosition?: NodeType['sourcePosition'];
  targetPosition?: NodeType['targetPosition'];
  dragHandle?: NodeType['dragHandle'];
  parentId?: NodeType['parentId'];
}

/**
 * The `BuiltInNode` type represents the built-in node types that are available in Vue Flow. You can use
 * this type to extend your custom node type if you still want to use the built-in ones.
 */
export type BuiltInNode = Node<{ label: string }, 'input' | 'output' | 'default'> | Node<Record<string, never>, 'group'>;

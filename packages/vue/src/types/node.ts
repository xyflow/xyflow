import type { InternalNodeBase, NodeBase } from '@xyflow/system';
import type { HTMLAttributes } from 'vue';
import type { ClassValue, Styles } from './flow';
import type { HandleElement } from './handle';

/**
 * Origin of a node relative to its position. `[0, 0]` is top-left, `[0.5, 0.5]` centers it, `[1, 1]` is bottom-right.
 *
 * Locally defined (rather than re-exported from `@xyflow/system`) so the Vue SFC compiler stays out of the
 * system d.ts (its `Optional<T, K>` utility trips vuejs/core#14236). Structurally identical to system's.
 */
export type NodeOrigin = [number, number];

export interface NodeHandleBounds {
  source: HandleElement[] | null;
  target: HandleElement[] | null;
}

/**
 * User-facing node type — reuses `@xyflow/system`'s `NodeBase`.
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
 * Props passed to custom node components, parameterized on a `NodeType`.
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
  isConnectable: boolean;
  positionAbsoluteX: number;
  positionAbsoluteY: number;
  width?: NodeType['width'];
  height?: NodeType['height'];
  sourcePosition?: NodeType['sourcePosition'];
  targetPosition?: NodeType['targetPosition'];
  dragHandle?: NodeType['dragHandle'];
  parentId?: NodeType['parentId'];
}

export type BuiltInNode = Node<{ label: string }, 'input' | 'output' | 'default'> | Node<Record<string, never>, 'group'>;

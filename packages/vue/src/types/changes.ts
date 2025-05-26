import type {
  EdgeRemoveChange,
  EdgeSelectionChange,
  NodeDimensionChange,
  NodePositionChange,
  NodeRemoveChange,
  NodeSelectionChange,
  XYPosition,
} from '@xyflow/system';
import type { Edge } from './edge';
import type { Node, NodeOrigin } from './node';

/**
 * Drag-item shape used by the drag pipeline.
 *
 * Mirrors `@xyflow/system`'s `NodeDragItem` exactly so vue-flow's drag items are interchangeable with
 * system types.
 */
export interface NodeDragItem {
  id: string;
  /** relative node position (to parent) */
  position: XYPosition;
  /** distance from the mouse cursor to the node when start dragging */
  distance: XYPosition;

  measured: { width: number; height: number };
  internals: { positionAbsolute: XYPosition };

  extent?: Node['extent'];
  expandParent?: boolean;
  dragging?: boolean;
  origin?: NodeOrigin;
  parentId?: string;
}

/**
 * Node change types — mirror `@xyflow/system`'s shapes (no `replace` variant yet).
 *
 * Renames vs the previous vue-flow shape:
 *   - `NodeDimensionChange.updateStyle` → `setAttributes` (truthy = set width/height on the DOM element;
 *     `'width'` / `'height'` restricts which axis is written).
 *   - `NodePositionChange.from` (the OLD absolute position) → dropped. Use `positionAbsolute` (the NEW
 *     absolute position) which now matches xyflow/react / xyflow/svelte.
 *
 * Item shapes on add changes are the user-provided `Node` / `Edge` types (not the internal `InternalNode`).
 */
export interface NodeAddChange<NodeType extends Node = Node> {
  item: NodeType;
  type: 'add';
  index?: number;
}

export type NodeChange<NodeType extends Node = Node>
  = | NodeDimensionChange
    | NodePositionChange
    | NodeSelectionChange
    | NodeRemoveChange
    | NodeAddChange<NodeType>;

export interface EdgeAddChange<EdgeType extends Edge = Edge> {
  item: EdgeType;
  type: 'add';
  index?: number;
}

export type EdgeChange<EdgeType extends Edge = Edge> = EdgeSelectionChange | EdgeRemoveChange | EdgeAddChange<EdgeType>;

export type ElementChange = NodeChange | EdgeChange;

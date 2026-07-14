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

export interface NodeAddChange<NodeType extends Node = Node> {
  item: NodeType;
  type: 'add';
  index?: number;
}

/**
 * The `nodes-change` event passes an array of `NodeChange` objects that you should use to update your
 * flow's state. The `NodeChange` type is a union of the different object types that represent the
 * various ways a node can change in a flow.
 */
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

/**
 * The `edges-change` event passes an array of `EdgeChange` objects that you should use to update your
 * flow's state. The `EdgeChange` type is a union of the different object types that represent the
 * various ways an edge can change in a flow.
 */
export type EdgeChange<EdgeType extends Edge = Edge> = EdgeSelectionChange | EdgeRemoveChange | EdgeAddChange<EdgeType>;

export type ElementChange = NodeChange | EdgeChange;

import type { AddChange, DimensionChange, PositionChange, RemoveChange, SelectionChange } from '@xyflow/system';
import type { Edge } from './edge';
import type { Node } from './node';

/**
 * The `nodes-change` event passes an array of `NodeChange` objects that you should use to update your
 * flow's state. The `NodeChange` type is a union of the different object types that represent the
 * various ways a node can change in a flow.
 */
export type NodeChange<NodeType extends Node = Node> =
  | DimensionChange
  | PositionChange
  | SelectionChange
  | RemoveChange
  | AddChange<NodeType>;

/**
 * The `edges-change` event passes an array of `EdgeChange` objects that you should use to update your
 * flow's state. The `EdgeChange` type is a union of the different object types that represent the
 * various ways an edge can change in a flow.
 */
export type EdgeChange<EdgeType extends Edge = Edge> = SelectionChange | RemoveChange | AddChange<EdgeType>;

export type ElementChange = NodeChange | EdgeChange;

import type { Dimensions, XYPosition } from '@xyflow/system';
import type { Edge, Node } from '../types/index.js';

export type NodeChange<NodeType extends Node = Node> =
  | DimensionChange
  | PositionChange
  | SelectionChange
  | RemoveChange
  | AddChange<NodeType>
  | ReplaceChange<NodeType>;

export type EdgeChange<EdgeType extends Edge = Edge> =
  | SelectionChange
  | RemoveChange
  | AddChange<EdgeType>
  | ReplaceChange<EdgeType>;

// Narrow down change type based on the element type (Node -> NodeChange, Edge -> EdgeChange)
export type ElementChangeType<ElementType extends Node | Edge> =
  | NodeChange<ElementType & Node>
  | EdgeChange<ElementType & Edge>;

export type DimensionChange = {
  id: string;
  type: 'dimensions';
  dimensions?: Dimensions;
  /* if this is true, the node is currently being resized via the NodeResizer */
  resizing?: boolean;
  /* if this is true, we will set width and height of the node and not just the measured dimensions */
  setAttributes?: boolean | 'width' | 'height';
};

export type PositionChange = {
  id: string;
  type: 'position';
  position?: XYPosition;
  positionAbsolute?: XYPosition;
  dragging?: boolean;
};

export type SelectionChange = {
  id: string;
  type: 'select';
  selected: boolean;
};

export type RemoveChange = {
  id: string;
  type: 'remove';
};

export type AddChange<NodeOrEdge> = {
  id: string;
  item: NodeOrEdge;
  type: 'add';
  index?: number;
};

export type ReplaceChange<NodeOrEdge> = {
  id: string;
  item: NodeOrEdge;
  type: 'replace';
};

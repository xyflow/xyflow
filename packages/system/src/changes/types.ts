import type { EdgeBase, NodeBase } from '../types';
import type { Dimensions, XYPosition } from '@xyflow/system';

export type NodeChange<NodeType extends NodeBase = NodeBase> =
  | DimensionChange
  | PositionChange
  | SelectionChange
  | RemoveChange
  | AddChange<NodeType>
  | ReplaceChange<NodeType>;

export type EdgeChange<EdgeType extends EdgeBase = EdgeBase> =
  | SelectionChange
  | RemoveChange
  | AddChange<EdgeType>
  | ReplaceChange<EdgeType>;

// Narrow down change type based on the element type (Node -> NodeChange, Edge -> EdgeChange)
export type ElementChangeType<ElementType extends NodeBase | EdgeBase> =
  | NodeChange<ElementType & NodeBase>
  | EdgeChange<ElementType & EdgeBase>;

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

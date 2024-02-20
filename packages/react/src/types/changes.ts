import type { XYPosition, Dimensions } from '@xyflow/system';

import type { Node, Edge } from '.';

export type NodeDimensionChange = {
  id: string;
  type: 'dimensions';
  dimensions?: Dimensions;
  resizing?: boolean;
};

export type NodePositionChange = {
  id: string;
  type: 'position';
  position?: XYPosition;
  positionAbsolute?: XYPosition;
  dragging?: boolean;
};

export type NodeSelectionChange = {
  id: string;
  type: 'select';
  selected: boolean;
};

export type NodeRemoveChange = {
  id: string;
  type: 'remove';
};

export type NodeAddChange<NodeType extends Node = Node> = {
  item: NodeType;
  type: 'add';
};

export type NodeReplaceChange<NodeType extends Node = Node> = {
  id: string;
  item: NodeType;
  type: 'replace';
};

/**
 * Union type of all possible node changes.
 * @public
 */
export type NodeChange<NodeType extends Node = Node> =
  | NodeDimensionChange
  | NodePositionChange
  | NodeSelectionChange
  | NodeRemoveChange
  | NodeAddChange<NodeType>
  | NodeReplaceChange<NodeType>;

export type EdgeSelectionChange = NodeSelectionChange;
export type EdgeRemoveChange = NodeRemoveChange;
export type EdgeAddChange<EdgeType extends Edge = Edge> = {
  item: EdgeType;
  type: 'add';
};

export type EdgeReplaceChange<EdgeType extends Edge = Edge> = {
  id: string;
  item: EdgeType;
  type: 'replace';
};

export type EdgeChange<EdgeType extends Edge = Edge> =
  | EdgeSelectionChange
  | EdgeRemoveChange
  | EdgeAddChange<EdgeType>
  | EdgeReplaceChange<EdgeType>;

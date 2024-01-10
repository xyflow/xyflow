/* eslint-disable @typescript-eslint/no-explicit-any */
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

export type NodeResetChange<NodeType extends Node = Node> = {
  item: NodeType;
  type: 'reset';
};

/**
 * Union type of all possible node changes.
 * @public
 */
export type NodeChange =
  | NodeDimensionChange
  | NodePositionChange
  | NodeSelectionChange
  | NodeRemoveChange
  | NodeAddChange
  | NodeResetChange;

export type EdgeSelectionChange = NodeSelectionChange;
export type EdgeRemoveChange = NodeRemoveChange;
export type EdgeAddChange<EdgeType extends Edge = Edge> = {
  item: EdgeType;
  type: 'add';
};
export type EdgeResetChange<EdgeType extends Edge = Edge> = {
  item: EdgeType;
  type: 'reset';
};
export type EdgeChange = EdgeSelectionChange | EdgeRemoveChange | EdgeAddChange | EdgeResetChange;

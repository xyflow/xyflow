/* eslint-disable @typescript-eslint/no-explicit-any */

import type { XYPosition, Dimensions } from './utils';
import type { Node } from './nodes';
import type { Edge } from './edges';

export type NodeDimensionChange = {
  id: string;
  type: 'dimensions';
  dimensions?: Dimensions;
  updateStyle?: boolean;
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

export type NodeAddChange<NodeData = any> = {
  item: Node<NodeData>;
  type: 'add';
};

export type NodeResetChange<NodeData = any> = {
  item: Node<NodeData>;
  type: 'reset';
};

export type NodeChange =
  | NodeDimensionChange
  | NodePositionChange
  | NodeSelectionChange
  | NodeRemoveChange
  | NodeAddChange
  | NodeResetChange;

export type EdgeSelectionChange = NodeSelectionChange;
export type EdgeRemoveChange = NodeRemoveChange;
export type EdgeAddChange<EdgeData = any> = {
  item: Edge<EdgeData>;
  type: 'add';
};
export type EdgeResetChange<EdgeData = any> = {
  item: Edge<EdgeData>;
  type: 'reset';
};
export type EdgeChange = EdgeSelectionChange | EdgeRemoveChange | EdgeAddChange | EdgeResetChange;

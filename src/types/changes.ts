import { XYPosition, Dimensions } from './utils';
import { NodeHandleBounds } from './nodes';

export type NodeDimensionChange = {
  id: string;
  type: 'dimensions';
  dimensions: Dimensions;
  handleBounds?: NodeHandleBounds;
};

export type NodePositionChange = {
  id: string;
  type: 'position';
  position?: XYPosition;
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

export type NodeChange = NodeDimensionChange | NodePositionChange | NodeSelectionChange | NodeRemoveChange;

export type EdgeSelectionChange = NodeSelectionChange;
export type EdgeRemoveChange = NodeRemoveChange;
export type EdgeChange = EdgeSelectionChange | EdgeRemoveChange;

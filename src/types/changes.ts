import { XYPosition, Dimensions } from './utils';
import { NodeHandleBounds } from './nodes';

export type NodeDimensionChange = {
  id: string;
  type: 'dimensions';
  dimensions?: Dimensions;
  position?: XYPosition;
  handleBounds?: NodeHandleBounds;
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

export type NodeChange = NodeDimensionChange | NodeSelectionChange | NodeRemoveChange;

export type EdgeSelectionChange = NodeSelectionChange;
export type EdgeRemoveChange = NodeRemoveChange;
export type EdgeChange = EdgeSelectionChange | EdgeRemoveChange;

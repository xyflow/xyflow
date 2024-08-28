import type { XYPosition, Dimensions, NodeBase, EdgeBase } from '.';

export type NodeDimensionChange = {
  id: string;
  type: 'dimensions';
  dimensions?: Dimensions;
  /* if this is true, the node is currently being resized via the NodeResizer */
  resizing?: boolean;
  /* if this is true, we will set width and height of the node and not just the measured dimensions */
  setAttributes?: boolean;
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

export type NodeAddChange<NodeType extends NodeBase = NodeBase> = {
  item: NodeType;
  type: 'add';
  index?: number;
};

export type NodeReplaceChange<NodeType extends NodeBase = NodeBase> = {
  id: string;
  item: NodeType;
  type: 'replace';
};

/**
 * Union type of all possible node changes.
 * @public
 */
export type NodeChange<NodeType extends NodeBase = NodeBase> =
  | NodeDimensionChange
  | NodePositionChange
  | NodeSelectionChange
  | NodeRemoveChange
  | NodeAddChange<NodeType>
  | NodeReplaceChange<NodeType>;

export type EdgeSelectionChange = NodeSelectionChange;
export type EdgeRemoveChange = NodeRemoveChange;
export type EdgeAddChange<EdgeType extends EdgeBase = EdgeBase> = {
  item: EdgeType;
  type: 'add';
  index?: number;
};

export type EdgeReplaceChange<EdgeType extends EdgeBase = EdgeBase> = {
  id: string;
  item: EdgeType;
  type: 'replace';
};

export type EdgeChange<EdgeType extends EdgeBase = EdgeBase> =
  | EdgeSelectionChange
  | EdgeRemoveChange
  | EdgeAddChange<EdgeType>
  | EdgeReplaceChange<EdgeType>;

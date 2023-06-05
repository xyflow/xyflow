import {
  isNodeBase,
  isEdgeBase,
  addEdgeBase,
  getOutgoersBase,
  getIncomersBase,
  updateEdgeBase,
  getConnectedEdgesBase,
} from '@xyflow/system';

import type { Edge, Node } from '../types';

export const isNode = isNodeBase<Node, Edge>;
export const isEdge = isEdgeBase<Node, Edge>;
export const getOutgoers = getOutgoersBase<Node, Edge>;
export const getIncomers = getIncomersBase<Node, Edge>;
export const addEdge = addEdgeBase<Edge>;
export const updateEdge = updateEdgeBase<Edge>;
export const getConnectedEdges = getConnectedEdgesBase<Node, Edge>;

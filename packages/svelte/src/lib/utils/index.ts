import {
  isNodeBase,
  isEdgeBase,
  addEdgeBase,
  getOutgoersBase,
  getIncomersBase,
  updateEdgeBase,
  getConnectedEdgesBase
} from '@xyflow/system';

import type { Edge, Node } from '$lib/types';

export const isNode = isNodeBase<Node>;
export const isEdge = isEdgeBase<Edge>;
export const getOutgoers = getOutgoersBase<Node, Edge>;
export const getIncomers = getIncomersBase<Node, Edge>;
export const addEdge = addEdgeBase<Edge>;
export const updateEdge = updateEdgeBase<Edge>;
export const getConnectedEdges = getConnectedEdgesBase<Node, Edge>;

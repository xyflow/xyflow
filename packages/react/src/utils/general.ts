import {
  isNodeBase,
  isEdgeBase,
  addEdgeBase,
  getOutgoersBase,
  getIncomersBase,
  updateEdgeBase,
  getConnectedEdgesBase,
  Connection,
} from '@xyflow/system';

import type { Edge, Node } from '../types';

export const isNode = isNodeBase<Node, Edge>;
export const isEdge = isEdgeBase<Node, Edge>;
export const getOutgoers = getOutgoersBase<Node, Edge>;
export const getIncomers = getIncomersBase<Node, Edge>;
export const addEdge = addEdgeBase<Edge>;
export const updateEdge = updateEdgeBase<Edge>;
export const getConnectedEdges = getConnectedEdgesBase<Node, Edge>;

export function isSameConnection(a: Connection, b: Connection) {
  return (
    a.source === b.source &&
    a.target === b.target &&
    a.sourceHandle === b.sourceHandle &&
    a.targetHandle === b.targetHandle
  );
}

export function areConnectionsEqual(a: Connection[] | null | undefined, b: Connection[] | null | undefined) {
  if (!a && !b) {
    return true;
  }

  if (!a || !b) {
    return false;
  }

  if (a.length !== b.length) {
    return false;
  }

  if (!a.length && !b.length) {
    return true;
  }

  return !a.some((connA) => !b.find((connB) => isSameConnection(connA, connB)));
}

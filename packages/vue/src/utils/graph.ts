import type { Connection } from '@xyflow/system';
import type { Edge, InternalNode, Node } from '../types';
import { isEdgeBase, isInternalNodeBase, isNodeBase } from '@xyflow/system';

/**
 * Test whether an object is usable as an `Edge`. In TypeScript this is a type guard that narrows the type
 * of whatever you pass in to `Edge` if it returns `true`.
 *
 * @param element - The element to test.
 * @returns `true` if the value can be used as an `Edge`.
 *
 * @example
 * ```js
 * import { isEdge } from '@xyflow/vue';
 *
 * if (isEdge(edge)) {
 *   // ...
 * }
 * ```
 */
export function isEdge<EdgeType extends Edge = Edge>(element: unknown): element is EdgeType {
  return !!element && typeof element === 'object' && isEdgeBase(element);
}

/**
 * Test whether an object is usable as a `Node`. In TypeScript this is a type guard that narrows the type
 * of whatever you pass in to `Node` if it returns `true`.
 *
 * @param element - The element to test.
 * @returns `true` if the value can be used as a `Node`.
 *
 * @example
 * ```js
 * import { isNode } from '@xyflow/vue';
 *
 * if (isNode(node)) {
 *   // ...
 * }
 * ```
 */
export function isNode<NodeType extends Node = Node>(element: unknown): element is NodeType {
  return !!element && typeof element === 'object' && isNodeBase(element);
}

export function isInternalNode<NodeType extends Node = Node>(element: unknown): element is InternalNode<NodeType> {
  return !!element && typeof element === 'object' && isInternalNodeBase(element);
}

export function connectionExists(edge: Edge | Connection, edges: Edge[]) {
  return edges.some(
    el =>
      el.source === edge.source
      && el.target === edge.target
      && (el.sourceHandle === edge.sourceHandle || (!el.sourceHandle && !edge.sourceHandle))
      && (el.targetHandle === edge.targetHandle || (!el.targetHandle && !edge.targetHandle)),
  );
}

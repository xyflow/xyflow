import { createEventDispatcher } from 'svelte';
import { isNodeBase, isEdgeBase } from '@xyflow/system';

import type { Edge, Node } from '$lib/types';

/**
 * Test whether an object is useable as a Node
 * @public
 * @remarks In TypeScript this is a type guard that will narrow the type of whatever you pass in to Node if it returns true
 * @param element - The element to test
 * @returns A boolean indicating whether the element is an Node
 */
export const isNode = <NodeType extends Node = Node>(element: unknown): element is NodeType =>
  isNodeBase<NodeType>(element);

/**
 * Test whether an object is useable as an Edge
 * @public
 * @remarks In TypeScript this is a type guard that will narrow the type of whatever you pass in to Edge if it returns true
 * @param element - The element to test
 * @returns A boolean indicating whether the element is an Edge
 */
export const isEdge = <EdgeType extends Edge = Edge>(element: unknown): element is EdgeType =>
  isEdgeBase<EdgeType>(element);

export const createNodeEventDispatcher = () =>
  createEventDispatcher<{
    nodeclick: { node: Node; event: MouseEvent | TouchEvent };
    nodecontextmenu: { node: Node; event: MouseEvent | TouchEvent };
    nodedrag: { targetNode: Node | null; nodes: Node[]; event: MouseEvent | TouchEvent };
    nodedragstart: { targetNode: Node | null; nodes: Node[]; event: MouseEvent | TouchEvent };
    nodedragstop: { targetNode: Node | null; nodes: Node[]; event: MouseEvent | TouchEvent };
    nodemouseenter: { node: Node; event: MouseEvent | TouchEvent };
    nodemouseleave: { node: Node; event: MouseEvent | TouchEvent };
    nodemousemove: { node: Node; event: MouseEvent | TouchEvent };
  }>();

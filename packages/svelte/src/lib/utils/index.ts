import type { HandleElement, Position } from '@reactflow/system';
import {
  isNodeBase,
  isEdgeBase,
  addEdgeBase,
  getOutgoersBase,
  getIncomersBase,
  updateEdgeBase,
  getConnectedEdgesBase,
  getDimensions
} from '@reactflow/utils';
import type { Edge, Node } from '$lib/types';

export const isNode = isNodeBase<Node, Edge>;
export const isEdge = isEdgeBase<Node, Edge>;
export const getOutgoers = getOutgoersBase<Node, Edge>;
export const getIncomers = getIncomersBase<Node, Edge>;
export const addEdge = addEdgeBase<Edge>;
export const updateEdge = updateEdgeBase<Edge>;
export const getConnectedEdges = getConnectedEdgesBase<Node, Edge>;

export const getHandleBounds = (
  selector: string,
  nodeElement: HTMLDivElement,
  zoom: number
): HandleElement[] | null => {
  const handles = nodeElement.querySelectorAll(selector);

  if (!handles || !handles.length) {
    return null;
  }

  const handlesArray = Array.from(handles) as HTMLDivElement[];
  const nodeBounds = nodeElement.getBoundingClientRect();

  return handlesArray.map((handle): HandleElement => {
    const handleBounds = handle.getBoundingClientRect();

    return {
      id: handle.getAttribute('data-handleid'),
      position: handle.getAttribute('data-handlepos') as unknown as Position,
      x: (handleBounds.left - nodeBounds.left) / zoom,
      y: (handleBounds.top - nodeBounds.top) / zoom,
      ...getDimensions(handle)
    };
  });
};

import { zoomIdentity } from 'd3-zoom';

import store from '../store';
import { ElementId, Node, Edge, Elements, Transform, XYPosition, Rect, FitViewParams, Box } from '../types';

export const isEdge = (element: Node | Edge): boolean =>
  element.hasOwnProperty('source') && element.hasOwnProperty('target');

export const isNode = (element: Node | Edge): boolean =>
  !element.hasOwnProperty('source') && !element.hasOwnProperty('target');

export const getOutgoers = (node: Node, elements: Elements): Elements => {
  if (!isNode(node)) {
    return [];
  }

  const outgoerIds = (elements as Edge[]).filter(e => e.source === node.id).map(e => e.target);
  return elements.filter(e => outgoerIds.includes(e.id));
};

export const removeElements = (elementsToRemove: Elements, elements: Elements): Elements => {
  const nodeIdsToRemove = elementsToRemove.map(n => n.id);

  return elements.filter(element => {
    const edgeElement = element as Edge;
    return !(
      nodeIdsToRemove.includes(element.id) ||
      nodeIdsToRemove.includes(edgeElement.target) ||
      nodeIdsToRemove.includes(edgeElement.source)
    );
  });
};

function getEdgeId(edgeParams: Edge): ElementId {
  return `reactflow__edge-${edgeParams.source}-${edgeParams.target}`;
}

export const addEdge = (edgeParams: Edge, elements: Elements): Elements => {
  if (!edgeParams.source || !edgeParams.target) {
    throw new Error('Can not create edge. An edge needs a source and a target');
  }

  return elements.concat({
    ...edgeParams,
    id: typeof edgeParams.id !== 'undefined' ? edgeParams.id : getEdgeId(edgeParams),
  });
};

const pointToRendererPoint = (
  { x, y }: XYPosition,
  transform: Transform,
  snapToGrid: boolean,
  snapGrid: [number, number]
): XYPosition => {
  let position: XYPosition = {
    x: (x - transform[0]) * (1 / transform[2]),
    y: (y - transform[1]) * (1 / transform[2]),
  };

  if (snapToGrid) {
    const transformedGridSizeX = snapGrid[0] * transform[2];
    const transformedGridSizeY = snapGrid[1] * transform[2];

    position = {
      x: transformedGridSizeX * Math.round(position.x / transformedGridSizeX),
      y: transformedGridSizeY * Math.round(position.y / transformedGridSizeY),
    };
  }

  return position;
};

export const parseElement = (
  element: Node | Edge,
  transform: Transform,
  snapToGrid: boolean,
  snapGrid: [number, number]
): Node | Edge => {
  if (!element.id) {
    throw new Error('All elements (nodes and edges) need to have an id.');
  }

  if (isEdge(element)) {
    return {
      ...element,
      id: element.id.toString(),
      type: element.type || 'default',
    };
  }

  const nodeElement = element as Node;

  return {
    ...nodeElement,
    id: nodeElement.id.toString(),
    type: nodeElement.type || 'default',
    __rg: {
      position: pointToRendererPoint(nodeElement.position, transform, snapToGrid, snapGrid),
      width: null,
      height: null,
      handleBounds: {},
    },
  };
};

const getBoundsOfBoxes = (box1: Box, box2: Box): Box => ({
  x: Math.min(box1.x, box2.x),
  y: Math.min(box1.y, box2.y),
  x2: Math.max(box1.x2, box2.x2),
  y2: Math.max(box1.y2, box2.y2),
});

const rectToBox = ({ x, y, width, height }: Rect): Box => ({
  x,
  y,
  x2: x + width,
  y2: y + height,
});

const boxToRect = ({ x, y, x2, y2 }: Box): Rect => ({
  x,
  y,
  width: x2 - x,
  height: y2 - y,
});

export const getBoundsofRects = (rect1: Rect, rect2: Rect): Rect =>
  boxToRect(getBoundsOfBoxes(rectToBox(rect1), rectToBox(rect2)));

export const getRectOfNodes = (nodes: Node[]): Rect => {
  const box = nodes.reduce(
    (currBox, { __rg: { position, width, height } }) =>
      getBoundsOfBoxes(currBox, rectToBox({ ...position, width, height })),
    { x: Infinity, y: Infinity, x2: -Infinity, y2: -Infinity }
  );

  return boxToRect(box);
};

export const graphPosToZoomedPos = (pos: XYPosition, transform: Transform): XYPosition => {
  return {
    x: pos.x * transform[2] + transform[0],
    y: pos.y * transform[2] + transform[1],
  };
};

export const getNodesInside = (
  nodes: Node[],
  rect: Rect,
  [tx, ty, tScale]: Transform = [0, 0, 1],
  partially: boolean = false
): Node[] => {
  const rBox = rectToBox({
    x: (rect.x - tx) / tScale,
    y: (rect.y - ty) / tScale,
    width: rect.width / tScale,
    height: rect.height / tScale,
  });
  return nodes.filter(({ __rg: { position, width, height } }) => {
    const nBox = rectToBox({ ...position, width, height });
    const overlappingArea =
      (Math.max(rBox.x, nBox.x) - Math.min(rBox.x2, nBox.x2)) * (Math.max(rBox.y, nBox.y) - Math.min(rBox.y2, nBox.y2));
    if (partially) {
      return overlappingArea > 0;
    }
    const area = width * height;
    return overlappingArea === area;
  });
};

export const getConnectedEdges = (nodes: Node[], edges: Edge[]): Edge[] => {
  const nodeIds = nodes.map(n => n.id);

  return edges.filter(e => {
    const hasSourceHandleId = e.source.includes('__');
    const hasTargetHandleId = e.target.includes('__');

    const sourceId = hasSourceHandleId ? e.source.split('__')[0] : e.source;
    const targetId = hasTargetHandleId ? e.target.split('__')[0] : e.target;

    return nodeIds.includes(sourceId) || nodeIds.includes(targetId);
  });
};

export const fitView = ({ padding }: FitViewParams = { padding: 0 }): void => {
  const state = store.getState();

  if (!state.d3Selection || !state.d3Zoom) {
    return;
  }

  const bounds = getRectOfNodes(state.nodes);
  const maxBoundsSize = Math.max(bounds.width, bounds.height);
  const k = Math.min(state.width, state.height) / (maxBoundsSize + maxBoundsSize * padding);
  const boundsCenterX = bounds.x + bounds.width / 2;
  const boundsCenterY = bounds.y + bounds.height / 2;
  const transform = [state.width / 2 - boundsCenterX * k, state.height / 2 - boundsCenterY * k];
  const fittedTransform = zoomIdentity.translate(transform[0], transform[1]).scale(k);

  state.d3Selection.call(state.d3Zoom.transform, fittedTransform);
};

export const zoomIn = (): void => {
  const state = store.getState();

  if (!state.d3Zoom || !state.d3Selection) {
    return;
  }

  state.d3Zoom.scaleTo(state.d3Selection, state.transform[2] + 0.2);
};

export const zoomOut = (): void => {
  const state = store.getState();

  if (!state.d3Zoom || !state.d3Selection) {
    return;
  }

  state.d3Zoom.scaleTo(state.d3Selection, state.transform[2] - 0.2);
};

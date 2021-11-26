import { boxToRect, clamp, getBoundsOfBoxes, rectToBox } from '../utils';

import { Node, Edge, Connection, EdgeMarkerType, Transform, XYPosition, Rect } from '../types';

export const isEdge = (element: Node | Connection | Edge): element is Edge =>
  'id' in element && 'source' in element && 'target' in element;

export const isNode = (element: Node | Connection | Edge): element is Node =>
  'id' in element && !('source' in element) && !('target' in element);

export const getOutgoers = (node: Node, nodes: Node[], edges: Edge[]): Node[] => {
  if (!isNode(node)) {
    return [];
  }

  const outgoerIds = edges.filter((e) => e.source === node.id).map((e) => e.target);
  return nodes.filter((n) => outgoerIds.includes(n.id));
};

export const getIncomers = (node: Node, nodes: Node[], edges: Edge[]): Node[] => {
  if (!isNode(node)) {
    return [];
  }

  const incomersIds = edges.filter((e) => e.target === node.id).map((e) => e.source);
  return nodes.filter((n) => incomersIds.includes(n.id));
};

const getEdgeId = ({ source, sourceHandle, target, targetHandle }: Connection): string =>
  `reactflow__edge-${source}${sourceHandle}-${target}${targetHandle}`;

export const getMarkerId = (marker: EdgeMarkerType | undefined): string => {
  if (typeof marker === 'undefined') {
    return '';
  }

  if (typeof marker === 'string') {
    return marker;
  }

  return Object.keys(marker)
    .sort()
    .map((key: string) => `${key}=${(marker as any)[key]}`)
    .join('&');
};

const connectionExists = (edge: Edge, edges: Edge[]) => {
  return edges.some(
    (el) =>
      el.source === edge.source &&
      el.target === edge.target &&
      (el.sourceHandle === edge.sourceHandle || (!el.sourceHandle && !edge.sourceHandle)) &&
      (el.targetHandle === edge.targetHandle || (!el.targetHandle && !edge.targetHandle))
  );
};

export const addEdge = (edgeParams: Edge | Connection, edges: Edge[]): Edge[] => {
  if (!edgeParams.source || !edgeParams.target) {
    console.warn("Can't create edge. An edge needs a source and a target.");
    return edges;
  }

  let edge: Edge;
  if (isEdge(edgeParams)) {
    edge = { ...edgeParams };
  } else {
    edge = {
      ...edgeParams,
      id: getEdgeId(edgeParams),
    } as Edge;
  }

  if (connectionExists(edge, edges)) {
    return edges;
  }

  return edges.concat(edge);
};

export const updateEdge = (oldEdge: Edge, newConnection: Connection, edges: Edge[]): Edge[] => {
  if (!newConnection.source || !newConnection.target) {
    console.warn("Can't create new edge. An edge needs a source and a target.");
    return edges;
  }

  const foundEdge = edges.find((e) => e.id === oldEdge.id) as Edge;

  if (!foundEdge) {
    console.warn(`The old edge with id=${oldEdge.id} does not exist.`);
    return edges;
  }

  // Remove old edge and create the new edge with parameters of old edge.
  const edge = {
    ...oldEdge,
    id: getEdgeId(newConnection),
    source: newConnection.source,
    target: newConnection.target,
    sourceHandle: newConnection.sourceHandle,
    targetHandle: newConnection.targetHandle,
  } as Edge;

  return edges.filter((e) => e.id !== oldEdge.id).concat(edge);
};

export const pointToRendererPoint = (
  { x, y }: XYPosition,
  [tx, ty, tScale]: Transform,
  snapToGrid: boolean,
  [snapX, snapY]: [number, number]
): XYPosition => {
  const position: XYPosition = {
    x: (x - tx) / tScale,
    y: (y - ty) / tScale,
  };

  if (snapToGrid) {
    return {
      x: snapX * Math.round(position.x / snapX),
      y: snapY * Math.round(position.y / snapY),
    };
  }

  return position;
};

export const getRectOfNodes = (nodes: Node[]): Rect => {
  const box = nodes.reduce(
    (currBox, { position, width, height }) =>
      getBoundsOfBoxes(currBox, rectToBox({ ...position, width: width || 0, height: height || 0 })),
    { x: Infinity, y: Infinity, x2: -Infinity, y2: -Infinity }
  );

  return boxToRect(box);
};

export const getNodesInside = (
  nodes: Node[],
  rect: Rect,
  [tx, ty, tScale]: Transform = [0, 0, 1],
  partially: boolean = false,
  // set excludeNonSelectableNodes if you want to pay attention to the nodes "selectable" attribute
  excludeNonSelectableNodes: boolean = false
): Node[] => {
  const rBox = rectToBox({
    x: (rect.x - tx) / tScale,
    y: (rect.y - ty) / tScale,
    width: rect.width / tScale,
    height: rect.height / tScale,
  });

  return nodes.filter(({ selectable = true, position, width, height, dragging }) => {
    if (excludeNonSelectableNodes && !selectable) {
      return false;
    }

    const nBox = rectToBox({ ...position, width: width || 0, height: height || 0 });
    const xOverlap = Math.max(0, Math.min(rBox.x2, nBox.x2) - Math.max(rBox.x, nBox.x));
    const yOverlap = Math.max(0, Math.min(rBox.y2, nBox.y2) - Math.max(rBox.y, nBox.y));
    const overlappingArea = Math.ceil(xOverlap * yOverlap);

    if (
      typeof width === 'undefined' ||
      typeof height === 'undefined' ||
      width === null ||
      height === null ||
      dragging
    ) {
      // nodes are initialized with width and height = null
      return true;
    }

    if (partially) {
      return overlappingArea > 0;
    }

    const area = (width || 0) * (height || 0);

    return overlappingArea >= area;
  });
};

export const getConnectedEdges = (nodes: Node[], edges: Edge[]): Edge[] => {
  const nodeIds = nodes.map((node) => node.id);

  return edges.filter((edge) => nodeIds.includes(edge.source) || nodeIds.includes(edge.target));
};

export const getTransformForBounds = (
  bounds: Rect,
  width: number,
  height: number,
  minZoom: number,
  maxZoom: number,
  padding: number = 0.1
): Transform => {
  const xZoom = width / (bounds.width * (1 + padding));
  const yZoom = height / (bounds.height * (1 + padding));
  const zoom = Math.min(xZoom, yZoom);
  const clampedZoom = clamp(zoom, minZoom, maxZoom);
  const boundsCenterX = bounds.x + bounds.width / 2;
  const boundsCenterY = bounds.y + bounds.height / 2;
  const x = width / 2 - boundsCenterX * clampedZoom;
  const y = height / 2 - boundsCenterY * clampedZoom;

  return [x, y, clampedZoom];
};

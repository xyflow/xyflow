import { Store } from 'redux';

import { clampPosition, clamp } from '../utils';

import {
  ElementId,
  Node,
  Edge,
  Elements,
  Transform,
  XYPosition,
  Rect,
  Box,
  Connection,
  FlowExportObject,
  ReactFlowState,
  NodeExtent,
} from '../types';

export const isEdge = (element: Node | Connection | Edge): element is Edge =>
  'id' in element && 'source' in element && 'target' in element;

export const isNode = (element: Node | Connection | Edge): element is Node =>
  'id' in element && !('source' in element) && !('target' in element);

export const getOutgoers = (node: Node, elements: Elements): Node[] => {
  if (!isNode(node)) {
    return [];
  }

  const outgoerIds = elements.filter((e) => isEdge(e) && e.source === node.id).map((e) => (e as Edge).target);
  return elements.filter((e) => outgoerIds.includes(e.id)) as Node[];
};

export const getIncomers = (node: Node, elements: Elements): Node[] => {
  if (!isNode(node)) {
    return [];
  }

  const incomersIds = elements.filter((e) => isEdge(e) && e.target === node.id).map((e) => (e as Edge).source);
  return elements.filter((e) => incomersIds.includes(e.id)) as Node[];
};

export const removeElements = (elementsToRemove: Elements, elements: Elements): Elements => {
  const nodeIdsToRemove = elementsToRemove.map((n) => n.id);

  return elements.filter((element) => {
    const edgeElement = element as Edge;
    return !(
      nodeIdsToRemove.includes(element.id) ||
      nodeIdsToRemove.includes(edgeElement.target) ||
      nodeIdsToRemove.includes(edgeElement.source)
    );
  });
};

const getEdgeId = ({ source, sourceHandle, target, targetHandle }: Connection): ElementId =>
  `reactflow__edge-${source}${sourceHandle}-${target}${targetHandle}`;

const connectionExists = (edge: Edge, elements: Elements) => {
  return elements.some(
    (el) =>
      isEdge(el) &&
      el.source === edge.source &&
      el.target === edge.target &&
      (el.sourceHandle === edge.sourceHandle || (!el.sourceHandle && !edge.sourceHandle)) &&
      (el.targetHandle === edge.targetHandle || (!el.targetHandle && !edge.targetHandle))
  );
};

export const addEdge = (edgeParams: Edge | Connection, elements: Elements): Elements => {
  if (!edgeParams.source || !edgeParams.target) {
    console.warn("Can't create edge. An edge needs a source and a target.");
    return elements;
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

  if (connectionExists(edge, elements)) {
    return elements;
  }

  return elements.concat(edge);
};

export const updateEdge = (oldEdge: Edge, newConnection: Connection, elements: Elements): Elements => {
  if (!newConnection.source || !newConnection.target) {
    console.warn("Can't create new edge. An edge needs a source and a target.");
    return elements;
  }

  const foundEdge = elements.find((e) => isEdge(e) && e.id === oldEdge.id) as Edge;

  if (!foundEdge) {
    console.warn(`The old edge with id=${oldEdge.id} does not exist.`);
    return elements;
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

  return elements.filter((e) => e.id !== oldEdge.id).concat(edge);
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

export const onLoadProject = (currentStore: Store<ReactFlowState>) => {
  return (position: XYPosition): XYPosition => {
    const { transform, snapToGrid, snapGrid } = currentStore.getState();

    return pointToRendererPoint(position, transform, snapToGrid, snapGrid);
  };
};

export const parseNode = (node: Node, nodeExtent: NodeExtent): Node => {
  return {
    ...node,
    id: node.id.toString(),
    type: node.type || 'default',
    __rf: {
      position: clampPosition(node.position, nodeExtent),
      width:  node.style?.width || null,
      height: node.style?.height || null,
      handleBounds: {},
      isDragging: false,
    },
  };
};

export const parseEdge = (edge: Edge): Edge => {
  return {
    ...edge,
    source: edge.source.toString(),
    target: edge.target.toString(),
    sourceHandle: edge.sourceHandle ? edge.sourceHandle.toString() : null,
    targetHandle: edge.targetHandle ? edge.targetHandle.toString() : null,
    id: edge.id.toString(),
    type: edge.type || 'default',
  };
};

const getBoundsOfBoxes = (box1: Box, box2: Box): Box => ({
  x: Math.min(box1.x, box2.x),
  y: Math.min(box1.y, box2.y),
  x2: Math.max(box1.x2, box2.x2),
  y2: Math.max(box1.y2, box2.y2),
});

export const rectToBox = ({ x, y, width, height }: Rect): Box => ({
  x,
  y,
  x2: x + width,
  y2: y + height,
});

export const boxToRect = ({ x, y, x2, y2 }: Box): Rect => ({
  x,
  y,
  width: x2 - x,
  height: y2 - y,
});

export const getBoundsofRects = (rect1: Rect, rect2: Rect): Rect =>
  boxToRect(getBoundsOfBoxes(rectToBox(rect1), rectToBox(rect2)));

export const getRectOfNodes = (nodes: Node[]): Rect => {
  const box = nodes.reduce(
    (currBox, { __rf: { position, width, height } = {} }) =>
      getBoundsOfBoxes(currBox, rectToBox({ ...position, width, height })),
    { x: Infinity, y: Infinity, x2: -Infinity, y2: -Infinity }
  );

  return boxToRect(box);
};

export const graphPosToZoomedPos = ({ x, y }: XYPosition, [tx, ty, tScale]: Transform): XYPosition => ({
  x: x * tScale + tx,
  y: y * tScale + ty,
});

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

  return nodes.filter(({ selectable = true, __rf: { position, width, height, isDragging } }) => {
    if (excludeNonSelectableNodes && !selectable) {
      return false;
    }

    const nBox = rectToBox({ ...position, width, height });
    const xOverlap = Math.max(0, Math.min(rBox.x2, nBox.x2) - Math.max(rBox.x, nBox.x));
    const yOverlap = Math.max(0, Math.min(rBox.y2, nBox.y2) - Math.max(rBox.y, nBox.y));
    const overlappingArea = Math.ceil(xOverlap * yOverlap);

    if (width === null || height === null || isDragging) {
      // nodes are initialized with width and height = null
      return true;
    }

    if (partially) {
      return overlappingArea > 0;
    }

    const area = width * height;

    return overlappingArea >= area;
  });
};

export const getConnectedEdges = (nodes: Node[], edges: Edge[]): Edge[] => {
  const nodeIds = nodes.map((node) => node.id);

  return edges.filter((edge) => nodeIds.includes(edge.source) || nodeIds.includes(edge.target));
};

const parseElements = (nodes: Node[], edges: Edge[]): Elements => {
  return [
    ...nodes.map((node) => {
      const n = { ...node };

      n.position = n.__rf.position;

      delete n.__rf;
      return n;
    }),
    ...edges.map((e) => ({ ...e })),
  ];
};

export const onLoadGetElements = (currentStore: Store<ReactFlowState>) => {
  return (): Elements => {
    const { nodes = [], edges = [] } = currentStore.getState();

    return parseElements(nodes, edges);
  };
};

export const onLoadToObject = (currentStore: Store<ReactFlowState>) => {
  return (): FlowExportObject => {
    const { nodes = [], edges = [], transform } = currentStore.getState();

    return {
      elements: parseElements(nodes, edges),
      position: [transform[0], transform[1]],
      zoom: transform[2],
    };
  };
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

import { GetState } from 'zustand';

import { clamp } from '../utils';

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
  EdgeChange,
  NodeChange,
  ReactFlowState,
  EdgeMarkerType,
} from '../types';

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

const getEdgeId = ({ source, sourceHandle, target, targetHandle }: Connection): ElementId =>
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

export const onLoadProject = (getState: GetState<ReactFlowState>) => {
  return (position: XYPosition): XYPosition => {
    const { transform, snapToGrid, snapGrid } = getState();

    return pointToRendererPoint(position, transform, snapToGrid, snapGrid);
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
    (currBox, { position, width, height }) =>
      getBoundsOfBoxes(currBox, rectToBox({ ...position, width: width || 0, height: height || 0 })),
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

  return nodes.filter(({ selectable = true, position, width, height, isDragging }) => {
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
      isDragging
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

export const onLoadGetNodes = (getState: GetState<ReactFlowState>) => {
  return (): Node[] => {
    const { nodes = [] } = getState();

    return nodes.map((n) => ({ ...n }));
  };
};

export const onLoadGetEdges = (getState: GetState<ReactFlowState>) => {
  return (): Edge[] => {
    const { edges = [] } = getState();

    return edges.map((e) => ({ ...e }));
  };
};

export const onLoadToObject = (getState: GetState<ReactFlowState>) => {
  return (): FlowExportObject => {
    const { nodes = [], edges = [], transform } = getState();

    return {
      nodes: nodes.map((n) => ({ ...n })),
      edges: edges.map((e) => ({ ...e })),
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

function applyChanges(changes: NodeChange[] | EdgeChange[], elements: any[]): any[] {
  const initElements: any[] = [];

  return elements.reduce((res: any[], item: any) => {
    const currentChange = changes.find((c) => c.id === item.id);

    if (currentChange) {
      switch (currentChange.type) {
        case 'select': {
          res.push({ ...item, isSelected: currentChange.isSelected });
          return res;
        }
        case 'dimensions': {
          const updateItem = { ...item };

          if (typeof currentChange.dimensions !== 'undefined') {
            updateItem.width = currentChange.dimensions.width;
            updateItem.height = currentChange.dimensions.height;
          }

          if (typeof currentChange.handleBounds !== 'undefined') {
            updateItem.handleBounds = currentChange.handleBounds;
          }

          if (typeof currentChange.position !== 'undefined') {
            updateItem.position = currentChange.position;
          }

          if (typeof currentChange.isDragging !== 'undefined') {
            updateItem.isDragging = currentChange.isDragging;
          }

          res.push(updateItem);
          return res;
        }
        case 'remove': {
          return res;
        }
      }
    }

    res.push(item);
    return res;
  }, initElements);
}

export function applyNodeChanges(changes: NodeChange[], nodes: Node[]): Node[] {
  return applyChanges(changes, nodes) as Node[];
}

export function applyEdgeChanges(changes: EdgeChange[], edges: Edge[]): Edge[] {
  return applyChanges(changes, edges) as Edge[];
}

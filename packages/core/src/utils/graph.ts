/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Selection as D3Selection } from 'd3';

import { boxToRect, clamp, devWarn, getBoundsOfBoxes, getOverlappingArea, rectToBox } from '../utils';
import {
  Node,
  Edge,
  Connection,
  EdgeMarkerType,
  Transform,
  XYPosition,
  Rect,
  NodeInternals,
  NodeOrigin,
  UpdateEdgeOptions,
} from '../types';
import { errorMessages } from '../contants';

export const isEdge = (element: Node | Connection | Edge): element is Edge =>
  'id' in element && 'source' in element && 'target' in element;

export const isNode = (element: Node | Connection | Edge): element is Node =>
  'id' in element && !('source' in element) && !('target' in element);

export const getOutgoers = <T = any, U extends T = T>(node: Node<U>, nodes: Node<T>[], edges: Edge[]): Node<T>[] => {
  if (!isNode(node)) {
    return [];
  }

  const outgoerIds = edges.filter((e) => e.source === node.id).map((e) => e.target);
  return nodes.filter((n) => outgoerIds.includes(n.id));
};

export const getIncomers = <T = any, U extends T = T>(node: Node<U>, nodes: Node<T>[], edges: Edge[]): Node<T>[] => {
  if (!isNode(node)) {
    return [];
  }

  const incomersIds = edges.filter((e) => e.target === node.id).map((e) => e.source);
  return nodes.filter((n) => incomersIds.includes(n.id));
};

const getEdgeId = ({ source, sourceHandle, target, targetHandle }: Connection): string =>
  `reactflow__edge-${source}${sourceHandle || ''}-${target}${targetHandle || ''}`;

export const getMarkerId = (marker: EdgeMarkerType | undefined, rfId?: string): string => {
  if (typeof marker === 'undefined') {
    return '';
  }

  if (typeof marker === 'string') {
    return marker;
  }

  const idPrefix = rfId ? `${rfId}__` : '';

  return `${idPrefix}${Object.keys(marker)
    .sort()
    .map((key: string) => `${key}=${(marker as any)[key]}`)
    .join('&')}`;
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
    devWarn('006', errorMessages['error006']());

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

export const updateEdge = (
  oldEdge: Edge,
  newConnection: Connection,
  edges: Edge[],
  options: UpdateEdgeOptions = { shouldReplaceId: true }
): Edge[] => {
  const { id: oldEdgeId, ...rest } = oldEdge;

  if (!newConnection.source || !newConnection.target) {
    devWarn('006', errorMessages['error006']());

    return edges;
  }

  const foundEdge = edges.find((e) => e.id === oldEdgeId) as Edge;

  if (!foundEdge) {
    devWarn('007', errorMessages['error007'](oldEdgeId));

    return edges;
  }

  // Remove old edge and create the new edge with parameters of old edge.
  const edge = {
    ...rest,
    id: options.shouldReplaceId ? getEdgeId(newConnection) : oldEdgeId,
    source: newConnection.source,
    target: newConnection.target,
    sourceHandle: newConnection.sourceHandle,
    targetHandle: newConnection.targetHandle,
  } as Edge;

  return edges.filter((e) => e.id !== oldEdgeId).concat(edge);
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

export const rendererPointToPoint = ({ x, y }: XYPosition, [tx, ty, tScale]: Transform): XYPosition => {
  return {
    x: x * tScale + tx,
    y: y * tScale + ty,
  };
};

export const getNodePositionWithOrigin = (
  node: Node | undefined,
  nodeOrigin: NodeOrigin = [0, 0]
): XYPosition & { positionAbsolute: XYPosition } => {
  if (!node) {
    return {
      x: 0,
      y: 0,
      positionAbsolute: {
        x: 0,
        y: 0,
      },
    };
  }

  const offsetX = (node.width ?? 0) * nodeOrigin[0];
  const offsetY = (node.height ?? 0) * nodeOrigin[1];

  const position: XYPosition = {
    x: node.position.x - offsetX,
    y: node.position.y - offsetY,
  };

  return {
    ...position,
    positionAbsolute: node.positionAbsolute
      ? {
          x: node.positionAbsolute.x - offsetX,
          y: node.positionAbsolute.y - offsetY,
        }
      : position,
  };
};

export const getRectOfNodes = (nodes: Node[], nodeOrigin: NodeOrigin = [0, 0]): Rect => {
  if (nodes.length === 0) {
    return { x: 0, y: 0, width: 0, height: 0 };
  }

  const box = nodes.reduce(
    (currBox, node) => {
      const { x, y } = getNodePositionWithOrigin(node, nodeOrigin).positionAbsolute;
      return getBoundsOfBoxes(
        currBox,
        rectToBox({
          x,
          y,
          width: node.width || 0,
          height: node.height || 0,
        })
      );
    },
    { x: Infinity, y: Infinity, x2: -Infinity, y2: -Infinity }
  );

  return boxToRect(box);
};

export const getNodesInside = (
  nodeInternals: NodeInternals,
  rect: Rect,
  [tx, ty, tScale]: Transform = [0, 0, 1],
  partially = false,
  // set excludeNonSelectableNodes if you want to pay attention to the nodes "selectable" attribute
  excludeNonSelectableNodes = false,
  nodeOrigin: NodeOrigin = [0, 0]
): Node[] => {
  const paneRect = {
    x: (rect.x - tx) / tScale,
    y: (rect.y - ty) / tScale,
    width: rect.width / tScale,
    height: rect.height / tScale,
  };

  const visibleNodes: Node[] = [];

  nodeInternals.forEach((node) => {
    const { width, height, selectable = true, hidden = false } = node;

    if ((excludeNonSelectableNodes && !selectable) || hidden) {
      return false;
    }

    const { positionAbsolute } = getNodePositionWithOrigin(node, nodeOrigin);

    const nodeRect = {
      x: positionAbsolute.x,
      y: positionAbsolute.y,
      width: width || 0,
      height: height || 0,
    };
    const overlappingArea = getOverlappingArea(paneRect, nodeRect);
    const notInitialized =
      typeof width === 'undefined' || typeof height === 'undefined' || width === null || height === null;

    const partiallyVisible = partially && overlappingArea > 0;
    const area = (width || 0) * (height || 0);
    const isVisible = notInitialized || partiallyVisible || overlappingArea >= area;

    if (isVisible || node.dragging) {
      visibleNodes.push(node);
    }
  });

  return visibleNodes;
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
  padding = 0.1
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

export const getD3Transition = (selection: D3Selection<Element, unknown, null, undefined>, duration = 0) => {
  return selection.transition().duration(duration);
};

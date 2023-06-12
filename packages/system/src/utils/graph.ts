/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  boxToRect,
  clamp,
  clampPosition,
  devWarn,
  getBoundsOfBoxes,
  getOverlappingArea,
  isNumeric,
  rectToBox,
  nodeToRect,
} from './utils';
import {
  type Connection,
  type Transform,
  type XYPosition,
  type Rect,
  type NodeOrigin,
  type BaseNode,
  type BaseEdge,
  type FitViewParamsBase,
  type FitViewOptionsBase,
  SnapGrid,
  NodeDragItem,
  CoordinateExtent,
  OnError,
} from '../types';
import { errorMessages } from '../constants';

export const isEdgeBase = <NodeType extends BaseNode = BaseNode, EdgeType extends BaseEdge = BaseEdge>(
  element: NodeType | Connection | EdgeType
): element is EdgeType => 'id' in element && 'source' in element && 'target' in element;

export const isNodeBase = <NodeType extends BaseNode = BaseNode, EdgeType extends BaseEdge = BaseEdge>(
  element: NodeType | Connection | EdgeType
): element is NodeType => 'id' in element && !('source' in element) && !('target' in element);

export const getOutgoersBase = <NodeType extends BaseNode = BaseNode, EdgeType extends BaseEdge = BaseEdge>(
  node: NodeType,
  nodes: NodeType[],
  edges: EdgeType[]
): NodeType[] => {
  if (!isNodeBase(node)) {
    return [];
  }

  const outgoerIds = edges.filter((e) => e.source === node.id).map((e) => e.target);
  return nodes.filter((n) => outgoerIds.includes(n.id));
};

export const getIncomersBase = <NodeType extends BaseNode = BaseNode, EdgeType extends BaseEdge = BaseEdge>(
  node: NodeType,
  nodes: NodeType[],
  edges: EdgeType[]
): NodeType[] => {
  if (!isNodeBase(node)) {
    return [];
  }

  const incomersIds = edges.filter((e) => e.target === node.id).map((e) => e.source);
  return nodes.filter((n) => incomersIds.includes(n.id));
};

const getEdgeId = ({ source, sourceHandle, target, targetHandle }: Connection | BaseEdge): string =>
  `xyflow__edge-${source}${sourceHandle || ''}-${target}${targetHandle || ''}`;

const connectionExists = (edge: BaseEdge, edges: BaseEdge[]) => {
  return edges.some(
    (el) =>
      el.source === edge.source &&
      el.target === edge.target &&
      (el.sourceHandle === edge.sourceHandle || (!el.sourceHandle && !edge.sourceHandle)) &&
      (el.targetHandle === edge.targetHandle || (!el.targetHandle && !edge.targetHandle))
  );
};

export const addEdgeBase = <EdgeType extends BaseEdge>(
  edgeParams: EdgeType | Connection,
  edges: EdgeType[]
): EdgeType[] => {
  if (!edgeParams.source || !edgeParams.target) {
    devWarn('006', errorMessages['error006']());

    return edges;
  }

  let edge: EdgeType;
  if (isEdgeBase(edgeParams)) {
    edge = { ...edgeParams };
  } else {
    edge = {
      ...edgeParams,
      id: getEdgeId(edgeParams),
    } as EdgeType;
  }

  if (connectionExists(edge, edges)) {
    return edges;
  }

  return edges.concat(edge);
};

export type UpdateEdgeOptions = {
  shouldReplaceId?: boolean;
};

export const updateEdgeBase = <EdgeType extends BaseEdge>(
  oldEdge: EdgeType,
  newConnection: Connection,
  edges: EdgeType[],
  options: UpdateEdgeOptions = { shouldReplaceId: true }
): EdgeType[] => {
  const { id: oldEdgeId, ...rest } = oldEdge;

  if (!newConnection.source || !newConnection.target) {
    devWarn('006', errorMessages['error006']());

    return edges;
  }

  const foundEdge = edges.find((e) => e.id === oldEdge.id) as EdgeType;

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
  } as EdgeType;

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
  node: BaseNode | undefined,
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

export const getRectOfNodes = (nodes: BaseNode[], nodeOrigin: NodeOrigin = [0, 0]): Rect => {
  if (nodes.length === 0) {
    return { x: 0, y: 0, width: 0, height: 0 };
  }

  const box = nodes.reduce(
    (currBox, node) => {
      const { x, y } = getNodePositionWithOrigin(node, node.origin || nodeOrigin).positionAbsolute;
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

export const getNodesInside = <NodeType extends BaseNode>(
  nodes: NodeType[],
  rect: Rect,
  [tx, ty, tScale]: Transform = [0, 0, 1],
  partially = false,
  // set excludeNonSelectableNodes if you want to pay attention to the nodes "selectable" attribute
  excludeNonSelectableNodes = false,
  nodeOrigin: NodeOrigin = [0, 0]
): NodeType[] => {
  const paneRect = {
    x: (rect.x - tx) / tScale,
    y: (rect.y - ty) / tScale,
    width: rect.width / tScale,
    height: rect.height / tScale,
  };

  const visibleNodes = nodes.reduce<NodeType[]>((res, node) => {
    const { width, height, selectable = true, hidden = false } = node;

    if ((excludeNonSelectableNodes && !selectable) || hidden) {
      return res;
    }

    const overlappingArea = getOverlappingArea(paneRect, nodeToRect(node, nodeOrigin));
    const notInitialized = width === undefined || height === undefined || width === null || height === null;

    const partiallyVisible = partially && overlappingArea > 0;
    const area = (width || 0) * (height || 0);
    const isVisible = notInitialized || partiallyVisible || overlappingArea >= area;

    if (isVisible || node.dragging) {
      res.push(node);
    }

    return res;
  }, []);

  return visibleNodes;
};

export const getConnectedEdgesBase = <NodeType extends BaseNode = BaseNode, EdgeType extends BaseEdge = BaseEdge>(
  nodes: NodeType[],
  edges: EdgeType[]
): EdgeType[] => {
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

export function fitView<Params extends FitViewParamsBase<BaseNode>, Options extends FitViewOptionsBase<BaseNode>>(
  { nodes, width, height, panZoom, minZoom, maxZoom, nodeOrigin = [0, 0] }: Params,
  options?: Options
) {
  const filteredNodes = nodes.filter((n) => {
    const isVisible = options?.includeHiddenNodes ? n.width && n.height : !n.hidden;

    if (options?.nodes?.length) {
      return isVisible && options?.nodes.some((optionNode) => optionNode.id === n.id);
    }

    return isVisible;
  });

  const nodesInitialized = filteredNodes.every((n) => n.width && n.height);

  if (nodes.length > 0 && nodesInitialized) {
    const bounds = getRectOfNodes(nodes, nodeOrigin);

    const [x, y, zoom] = getTransformForBounds(
      bounds,
      width,
      height,
      options?.minZoom ?? minZoom,
      options?.maxZoom ?? maxZoom,
      options?.padding ?? 0.1
    );

    panZoom.setViewport({ x, y, zoom }, { duration: options?.duration });

    return true;
  }

  return false;
}

export type GetPointerPositionParams = {
  transform: Transform;
  snapGrid?: SnapGrid;
  snapToGrid?: boolean;
};

export function getPointerPosition(
  event: MouseEvent | TouchEvent,
  { snapGrid = [0, 0], snapToGrid = false, transform }: GetPointerPositionParams
): XYPosition & { xSnapped: number; ySnapped: number } {
  const x = 'touches' in event ? event.touches[0].clientX : event.clientX;
  const y = 'touches' in event ? event.touches[0].clientY : event.clientY;

  const pointerPos = {
    x: (x - transform[0]) / transform[2],
    y: (y - transform[1]) / transform[2],
  };

  // we need the snapped position in order to be able to skip unnecessary drag events
  return {
    xSnapped: snapToGrid ? snapGrid[0] * Math.round(pointerPos.x / snapGrid[0]) : pointerPos.x,
    ySnapped: snapToGrid ? snapGrid[1] * Math.round(pointerPos.y / snapGrid[1]) : pointerPos.y,
    ...pointerPos,
  };
}

export function calcNextPosition<NodeType extends BaseNode>(
  node: NodeDragItem | NodeType,
  nextPosition: XYPosition,
  nodes: NodeType[],
  nodeExtent?: CoordinateExtent,
  nodeOrigin: NodeOrigin = [0, 0],
  onError?: OnError
): { position: XYPosition; positionAbsolute: XYPosition } {
  let currentExtent = node.extent || nodeExtent;
  let parentNode: NodeType;
  let parentPos = { x: 0, y: 0 };

  if (node.parentNode) {
    parentNode = nodes.find((n) => n.id === node.parentNode);
    parentPos = parentNode
      ? getNodePositionWithOrigin(parentNode, parentNode.origin || nodeOrigin).positionAbsolute
      : parentPos;
  }

  if (node.extent === 'parent') {
    if (node.parentNode && node.width && node.height) {
      const currNodeOrigin = node.origin || nodeOrigin;

      currentExtent =
        parentNode && isNumeric(parentNode.width) && isNumeric(parentNode.height)
          ? [
              [parentPos.x + node.width * currNodeOrigin[0], parentPos.y + node.height * currNodeOrigin[1]],
              [
                parentPos.x + parentNode.width - node.width + node.width * currNodeOrigin[0],
                parentPos.y + parentNode.height - node.height + node.height * currNodeOrigin[1],
              ],
            ]
          : currentExtent;
    } else {
      onError?.('005', errorMessages['error005']());
      currentExtent = nodeExtent;
    }
  } else if (node.extent && node.parentNode) {
    currentExtent = [
      [node.extent[0][0] + parentPos.x, node.extent[0][1] + parentPos.y],
      [node.extent[1][0] + parentPos.x, node.extent[1][1] + parentPos.y],
    ];
  }

  const positionAbsolute = currentExtent
    ? clampPosition(nextPosition, currentExtent as CoordinateExtent)
    : nextPosition;

  return {
    position: {
      x: positionAbsolute.x - parentPos.x,
      y: positionAbsolute.y - parentPos.y,
    },
    positionAbsolute,
  };
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { zoomIdentity } from 'd3-zoom';

import { boxToRect, clamp, devWarn, getBoundsOfBoxes, getOverlappingArea, rectToBox } from './utils';
import {
  errorMessages,
  type Connection,
  type EdgeMarkerType,
  type Transform,
  type XYPosition,
  type Rect,
  type NodeOrigin,
  type BaseNode,
  type BaseEdge,
  type FitViewParamsBase,
  type FitViewOptionsBase,
  type D3SelectionInstance,
} from '@reactflow/system';

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
    devWarn('006', errorMessages['006']());

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
    devWarn('006', errorMessages['006']());

    return edges;
  }

  const foundEdge = edges.find((e) => e.id === oldEdge.id) as EdgeType;

  if (!foundEdge) {
    devWarn('007', errorMessages['007'](oldEdgeId));

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

    const { positionAbsolute } = getNodePositionWithOrigin(node, node.origin || nodeOrigin);

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

export const getD3Transition = (selection: D3SelectionInstance, duration = 0) => {
  return selection.transition().duration(duration);
};

export function fitView<Params extends FitViewParamsBase<BaseNode>, Options extends FitViewOptionsBase<BaseNode>>(
  { nodes, width, height, d3Zoom, d3Selection, minZoom, maxZoom, nodeOrigin = [0, 0] }: Params,
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

    const nextTransform = zoomIdentity.translate(x, y).scale(zoom);

    if (typeof options?.duration === 'number' && options.duration > 0) {
      d3Zoom.transform(getD3Transition(d3Selection, options.duration), nextTransform);
    } else {
      d3Zoom.transform(d3Selection, nextTransform);
    }

    return true;
  }

  return false;
}

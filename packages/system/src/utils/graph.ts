/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  boxToRect,
  clampPosition,
  getBoundsOfBoxes,
  getOverlappingArea,
  isNumeric,
  rectToBox,
  nodeToRect,
  pointToRendererPoint,
  getTransformForBounds,
} from './general';
import {
  type Connection,
  type Transform,
  type XYPosition,
  type Rect,
  type NodeOrigin,
  type NodeBase,
  type EdgeBase,
  type FitViewParamsBase,
  type FitViewOptionsBase,
  NodeDragItem,
  CoordinateExtent,
  OnError,
} from '../types';
import { errorMessages } from '../constants';

export const isEdgeBase = <NodeType extends NodeBase = NodeBase, EdgeType extends EdgeBase = EdgeBase>(
  element: NodeType | Connection | EdgeType
): element is EdgeType => 'id' in element && 'source' in element && 'target' in element;

export const isNodeBase = <NodeType extends NodeBase = NodeBase, EdgeType extends EdgeBase = EdgeBase>(
  element: NodeType | Connection | EdgeType
): element is NodeType => 'id' in element && !('source' in element) && !('target' in element);

export const getOutgoersBase = <NodeType extends NodeBase = NodeBase, EdgeType extends EdgeBase = EdgeBase>(
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

export const getIncomersBase = <NodeType extends NodeBase = NodeBase, EdgeType extends EdgeBase = EdgeBase>(
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

export const getNodePositionWithOrigin = (
  node: NodeBase | undefined,
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

export const getRectOfNodes = (nodes: NodeBase[], nodeOrigin: NodeOrigin = [0, 0]): Rect => {
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

export const getNodesInside = <NodeType extends NodeBase>(
  nodes: NodeType[],
  rect: Rect,
  [tx, ty, tScale]: Transform = [0, 0, 1],
  partially = false,
  // set excludeNonSelectableNodes if you want to pay attention to the nodes "selectable" attribute
  excludeNonSelectableNodes = false,
  nodeOrigin: NodeOrigin = [0, 0]
): NodeType[] => {
  const paneRect = {
    ...pointToRendererPoint(rect, [tx, ty, tScale]),
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

export const getConnectedEdgesBase = <NodeType extends NodeBase = NodeBase, EdgeType extends EdgeBase = EdgeBase>(
  nodes: NodeType[],
  edges: EdgeType[]
): EdgeType[] => {
  const nodeIds = nodes.map((node) => node.id);

  return edges.filter((edge) => nodeIds.includes(edge.source) || nodeIds.includes(edge.target));
};

export function fitView<Params extends FitViewParamsBase<NodeBase>, Options extends FitViewOptionsBase<NodeBase>>(
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

function clampNodeExtent(node: NodeDragItem | NodeBase, extent?: CoordinateExtent | 'parent') {
  if (!extent || extent === 'parent') {
    return extent;
  }
  return [extent[0], [extent[1][0] - (node.width || 0), extent[1][1] - (node.height || 0)]];
}

export function calcNextPosition<NodeType extends NodeBase>(
  node: NodeDragItem | NodeType,
  nextPosition: XYPosition,
  nodes: NodeType[],
  nodeExtent?: CoordinateExtent,
  nodeOrigin: NodeOrigin = [0, 0],
  onError?: OnError
): { position: XYPosition; positionAbsolute: XYPosition } {
  const clampedNodeExtent = clampNodeExtent(node, node.extent || nodeExtent);
  let currentExtent = clampedNodeExtent;
  let parentNode: NodeType | null = null;
  let parentPos = { x: 0, y: 0 };

  if (node.parentNode) {
    parentNode = nodes.find((n) => n.id === node.parentNode) || null;
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
      currentExtent = clampedNodeExtent;
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

// helper function to get arrays of nodes and edges that can be deleted
// you can pass in a list of nodes and edges that should be deleted
// and the function only returns elements that are deletable and also handles connected nodes and child nodes
export function getElementsToRemove<NodeType extends NodeBase = NodeBase, EdgeType extends EdgeBase = EdgeBase>({
  nodesToRemove,
  edgesToRemove,
  nodes,
  edges,
}: {
  nodesToRemove: Partial<NodeType>[];
  edgesToRemove: Partial<EdgeType>[];
  nodes: NodeType[];
  edges: EdgeType[];
}): {
  matchingNodes: NodeType[];
  matchingEdges: EdgeType[];
} {
  const nodeIds = nodesToRemove.map((node) => node.id);
  const edgeIds = edgesToRemove.map((edge) => edge.id);

  const matchingNodes = nodes.reduce<NodeType[]>((res, node) => {
    const parentHit = !nodeIds.includes(node.id) && node.parentNode && res.find((n) => n.id === node.parentNode);
    const deletable = typeof node.deletable === 'boolean' ? node.deletable : true;
    if (deletable && (nodeIds.includes(node.id) || parentHit)) {
      res.push(node);
    }

    return res;
  }, []);
  const deletableEdges = edges.filter((e) => (typeof e.deletable === 'boolean' ? e.deletable : true));
  const initialHitEdges = deletableEdges.filter((e) => edgeIds.includes(e.id));
  const connectedEdges = getConnectedEdgesBase<NodeType, EdgeType>(matchingNodes, deletableEdges);
  const matchingEdges = [...initialHitEdges, ...connectedEdges];

  return {
    matchingEdges,
    matchingNodes,
  };
}

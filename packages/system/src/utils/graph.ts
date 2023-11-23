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
  getViewportForBounds,
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
  node: NodeType | { id: string },
  nodes: NodeType[],
  edges: EdgeType[]
): NodeType[] => {
  if (!node.id) {
    return [];
  }

  const outgoerIds = new Set();
  edges.forEach((edge) => {
    if (edge.source === node.id) {
      outgoerIds.add(edge.target);
    }
  });

  return nodes.filter((n) => outgoerIds.has(n.id));
};

export const getIncomersBase = <NodeType extends NodeBase = NodeBase, EdgeType extends EdgeBase = EdgeBase>(
  node: NodeType | { id: string },
  nodes: NodeType[],
  edges: EdgeType[]
): NodeType[] => {
  if (!node.id) {
    return [];
  }
  const incomersIds = new Set();
  edges.forEach((edge) => {
    if (edge.target === node.id) {
      incomersIds.add(edge.source);
    }
  });

  return nodes.filter((n) => incomersIds.has(n.id));
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

  const offsetX = (node.computed?.width ?? node.width ?? 0) * nodeOrigin[0];
  const offsetY = (node.computed?.height ?? node.height ?? 0) * nodeOrigin[1];

  const position: XYPosition = {
    x: node.position.x - offsetX,
    y: node.position.y - offsetY,
  };

  return {
    ...position,
    positionAbsolute: node.computed?.positionAbsolute
      ? {
          x: node.computed.positionAbsolute.x - offsetX,
          y: node.computed.positionAbsolute.y - offsetY,
        }
      : position,
  };
};

export const getNodesBounds = (nodes: NodeBase[], nodeOrigin: NodeOrigin = [0, 0]): Rect => {
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
          width: node.computed?.width ?? node.width ?? 0,
          height: node.computed?.height ?? node.height ?? 0,
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
    const { computed, selectable = true, hidden = false } = node;
    const width = computed?.width ?? node.width ?? null;
    const height = computed?.height ?? node.height ?? null;

    if ((excludeNonSelectableNodes && !selectable) || hidden) {
      return res;
    }

    const overlappingArea = getOverlappingArea(paneRect, nodeToRect(node, nodeOrigin));
    const notInitialized = width === null || height === null;

    const partiallyVisible = partially && overlappingArea > 0;
    const area = (width ?? 0) * (height ?? 0);
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
  const nodeIds = new Set();
  nodes.forEach((node) => {
    nodeIds.add(node.id);
  });

  return edges.filter((edge) => nodeIds.has(edge.source) || nodeIds.has(edge.target));
};

export function fitView<Params extends FitViewParamsBase<NodeBase>, Options extends FitViewOptionsBase<NodeBase>>(
  { nodes, width, height, panZoom, minZoom, maxZoom, nodeOrigin = [0, 0] }: Params,
  options?: Options
) {
  const filteredNodes = nodes.filter((n) => {
    const isVisible = n.computed?.width && n.computed?.height && (options?.includeHiddenNodes || !n.hidden);

    if (options?.nodes?.length) {
      return isVisible && options?.nodes.some((optionNode) => optionNode.id === n.id);
    }

    return isVisible;
  });

  if (filteredNodes.length > 0) {
    const bounds = getNodesBounds(filteredNodes, nodeOrigin);

    const viewport = getViewportForBounds(
      bounds,
      width,
      height,
      options?.minZoom ?? minZoom,
      options?.maxZoom ?? maxZoom,
      options?.padding ?? 0.1
    );

    panZoom.setViewport(viewport, { duration: options?.duration });

    return true;
  }

  return false;
}

function clampNodeExtent(node: NodeDragItem | NodeBase, extent?: CoordinateExtent | 'parent') {
  if (!extent || extent === 'parent') {
    return extent;
  }
  return [extent[0], [extent[1][0] - (node.computed?.width ?? 0), extent[1][1] - (node.computed?.height ?? 0)]];
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

  if (node.extent === 'parent' && !node.expandParent) {
    const nodeWidth = node.computed?.width;
    const nodeHeight = node.computed?.height;
    if (node.parentNode && nodeWidth && nodeHeight) {
      const currNodeOrigin = node.origin || nodeOrigin;

      currentExtent =
        parentNode && isNumeric(parentNode.computed?.width) && isNumeric(parentNode.computed?.height)
          ? [
              [parentPos.x + nodeWidth * currNodeOrigin[0], parentPos.y + nodeHeight * currNodeOrigin[1]],
              [
                parentPos.x + (parentNode.computed?.width ?? 0) - nodeWidth + nodeWidth * currNodeOrigin[0],
                parentPos.y + (parentNode.computed?.height ?? 0) - nodeHeight + nodeHeight * currNodeOrigin[1],
              ],
            ]
          : currentExtent;
    } else {
      onError?.('005', errorMessages['error005']());
      currentExtent = clampedNodeExtent;
    }
  } else if (node.extent && node.parentNode && node.extent !== 'parent') {
    currentExtent = [
      [node.extent[0][0] + parentPos.x, node.extent[0][1] + parentPos.y],
      [node.extent[1][0] + parentPos.x, node.extent[1][1] + parentPos.y],
    ];
  }

  const positionAbsolute =
    currentExtent && currentExtent !== 'parent'
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
  const matchingEdges = connectedEdges.reduce((res, edge) => {
    if (!res.find((e) => e.id === edge.id)) {
      res.push(edge);
    }

    return res;
  }, initialHitEdges);

  return {
    matchingEdges,
    matchingNodes,
  };
}

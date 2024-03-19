import {
  NodeBase,
  CoordinateExtent,
  NodeDimensionUpdate,
  NodeOrigin,
  PanZoomInstance,
  Transform,
  XYPosition,
  XYZPosition,
  ConnectionLookup,
  EdgeBase,
  EdgeLookup,
  InternalNodeBase,
  NodeLookup,
  Rect,
} from '../types';
import { NodeChange } from '../types/changes';
import { getDimensions, getHandleBounds } from './dom';
import { getBoundsOfRects, getNodeDimensions, isNumeric, nodeToRect } from './general';
import { getNodePositionWithOrigin } from './graph';

type ParentNodes = Record<string, boolean>;

export function updateAbsolutePositions<NodeType extends NodeBase>(
  nodes: NodeType[],
  nodeLookup: Map<string, InternalNodeBase<NodeType>>,
  nodeOrigin: NodeOrigin = [0, 0],
  parentNodes?: ParentNodes
) {
  nodes.forEach((node) => {
    if (node.parentNode && !nodeLookup.has(node.parentNode)) {
      throw new Error(`Parent node ${node.parentNode} not found`);
    }

    if (node.parentNode || parentNodes?.[node.id]) {
      const internalNode = nodeLookup.get(node.id)!;
      const parentNode = node.parentNode ? nodeLookup.get(node.parentNode) : null;
      const { x, y, z } = calculateXYZPosition(
        node,
        nodeLookup,
        {
          ...node.position,
          z: internalNode.computed.z ?? 0,
        },
        parentNode?.origin || nodeOrigin
      );

      const positionChanged =
        x !== internalNode.computed.positionAbsolute?.x || y !== internalNode.computed.positionAbsolute?.y;
      internalNode.computed.positionAbsolute = positionChanged
        ? {
            x,
            y,
          }
        : internalNode.computed.positionAbsolute;

      internalNode.computed.z = z;

      if (parentNodes?.[node.id]) {
        internalNode.computed.isParent = true;
      }
    }
  });
}

type UpdateNodesOptions<NodeType extends NodeBase> = {
  nodeOrigin?: NodeOrigin;
  elevateNodesOnSelect?: boolean;
  defaults?: Partial<NodeType>;
};

export function adoptUserProvidedNodes<NodeType extends NodeBase>(
  nodes: NodeType[],
  nodeLookup: Map<string, InternalNodeBase<NodeType>>,
  options: UpdateNodesOptions<NodeType> = {
    nodeOrigin: [0, 0] as NodeOrigin,
    elevateNodesOnSelect: true,
    defaults: {},
  }
) {
  const tmpLookup = new Map(nodeLookup);
  nodeLookup.clear();
  const parentNodes: ParentNodes = {};
  const selectedNodeZ: number = options?.elevateNodesOnSelect ? 1000 : 0;

  nodes.forEach((n) => {
    const storeNode = tmpLookup.get(n.id);
    if (n === storeNode?.computed.userProvidedNode) {
      nodeLookup.set(n.id, storeNode);
      return storeNode;
    }

    const z = (isNumeric(n.zIndex) ? n.zIndex : 0) + (n.selected ? selectedNodeZ : 0);
    const currInternals = storeNode?.computed;

    const node: InternalNodeBase<NodeType> = {
      ...options.defaults,
      ...n,
      computed: {
        handleBounds: currInternals?.handleBounds,
        positionAbsolute: n.position,
        width: n.width || currInternals?.width,
        height: n.height || currInternals?.height,
        userProvidedNode: n,
        z,
      },
    };

    if (node.parentNode) {
      parentNodes[node.parentNode] = true;
    }

    nodeLookup.set(node.id, node);
  });

  updateAbsolutePositions(nodes, nodeLookup, options.nodeOrigin, parentNodes);
}

function calculateXYZPosition<NodeType extends NodeBase>(
  node: NodeType,
  nodeLookup: Map<string, InternalNodeBase<NodeType>>,
  result: XYZPosition,
  nodeOrigin: NodeOrigin
): XYZPosition {
  if (!node.parentNode) {
    return result;
  }

  const parentNode = nodeLookup.get(node.parentNode)!;
  const { position: parentNodePosition } = getNodePositionWithOrigin(parentNode, parentNode?.origin || nodeOrigin);

  return calculateXYZPosition(
    parentNode,
    nodeLookup,
    {
      x: (result.x ?? 0) + parentNodePosition.x,
      y: (result.y ?? 0) + parentNodePosition.y,
      z: (parentNode.computed.z ?? 0) > (result.z ?? 0) ? parentNode.computed.z ?? 0 : result.z ?? 0,
    },
    parentNode.origin || nodeOrigin
  );
}

export function handleParentExpand(nodes: InternalNodeBase[], nodeLookup: NodeLookup): NodeChange[] {
  const changes: NodeChange[] = [];
  const parentRects = new Map<string, Rect>();

  nodes.forEach((node) => {
    if (node.expandParent && node.parentNode) {
      const parentNode = nodeLookup.get(node.parentNode);

      if (parentNode) {
        const parentRect = parentRects.get(node.parentNode) || nodeToRect(parentNode, node.origin);
        const expandedRect = getBoundsOfRects(parentRect, nodeToRect(node, node.origin));
        parentRects.set(node.parentNode, expandedRect);
      }
    }
  });

  // @todo handle position changes
  if (parentRects.size > 0) {
    parentRects.forEach((rect, id) => {
      const origParent = nodeLookup.get(id)!;
      const { positionAbsolute } = getNodePositionWithOrigin(origParent, origParent.origin);
      const dimensions = getNodeDimensions(origParent);

      if (positionAbsolute.x < rect.x || positionAbsolute.y < rect.y) {
        console.log('position and dim change');
      }

      if (dimensions.width < rect.width || dimensions.height < rect.height) {
        changes.push({
          id,
          type: 'dimensions',
          dimensions: {
            width: Math.max(dimensions.width, rect.width),
            height: Math.max(dimensions.height, rect.height),
          },
        });
      }
    });
  }

  return changes;
}

export function updateNodeDimensions<NodeType extends InternalNodeBase>(
  updates: Map<string, NodeDimensionUpdate>,
  nodeLookup: Map<string, NodeType>,
  domNode: HTMLElement | null,
  nodeOrigin?: NodeOrigin
): { hasUpdate: boolean; changes: NodeChange[] } {
  const viewportNode = domNode?.querySelector('.xyflow__viewport');
  const changes: NodeChange[] = [];
  let hasUpdate = false;

  if (!viewportNode) {
    return { hasUpdate, changes };
  }

  const style = window.getComputedStyle(viewportNode);
  const { m22: zoom } = new window.DOMMatrixReadOnly(style.transform);

  // in this array we collect nodes, that might trigger changes (like expanding parent)
  const triggerChangeNodes: NodeType[] = [];

  updates.forEach((update) => {
    const internalNode = nodeLookup.get(update.id);

    if (internalNode) {
      const dimensions = getDimensions(update.nodeElement);
      const doUpdate = !!(
        dimensions.width &&
        dimensions.height &&
        (internalNode.computed.width !== dimensions.width ||
          internalNode.computed.height !== dimensions.height ||
          update.forceUpdate)
      );

      if (doUpdate) {
        hasUpdate = true;
        const newNode = {
          ...internalNode,
          computed: {
            ...internalNode.computed,
            ...dimensions,
            handleBounds: {
              source: getHandleBounds('.source', update.nodeElement, zoom, internalNode.origin || nodeOrigin),
              target: getHandleBounds('.target', update.nodeElement, zoom, internalNode.origin || nodeOrigin),
            },
          },
        };

        nodeLookup.set(internalNode.id, newNode);

        if (internalNode.expandParent) {
          triggerChangeNodes.push(newNode);
        }
      }
    }
  });

  if (triggerChangeNodes.length > 0) {
    const parentExpandChanges = handleParentExpand(triggerChangeNodes, nodeLookup);
    changes.push(...parentExpandChanges);
  }

  return { hasUpdate, changes };
}

export function panBy({
  delta,
  panZoom,
  transform,
  translateExtent,
  width,
  height,
}: {
  delta: XYPosition;
  panZoom: PanZoomInstance | null;
  transform: Transform;
  translateExtent: CoordinateExtent;
  width: number;
  height: number;
}) {
  if (!panZoom || (!delta.x && !delta.y)) {
    return false;
  }

  const nextViewport = panZoom.setViewportConstrained(
    {
      x: transform[0] + delta.x,
      y: transform[1] + delta.y,
      zoom: transform[2],
    },
    [
      [0, 0],
      [width, height],
    ],
    translateExtent
  );

  const transformChanged =
    !!nextViewport &&
    (nextViewport.x !== transform[0] || nextViewport.y !== transform[1] || nextViewport.k !== transform[2]);

  return transformChanged;
}

export function updateConnectionLookup(connectionLookup: ConnectionLookup, edgeLookup: EdgeLookup, edges: EdgeBase[]) {
  connectionLookup.clear();
  edgeLookup.clear();

  for (const edge of edges) {
    const { source, target, sourceHandle = null, targetHandle = null } = edge;

    const sourceKey = `${source}-source-${sourceHandle}`;
    const targetKey = `${target}-target-${targetHandle}`;

    const prevSource = connectionLookup.get(sourceKey) || new Map();
    const prevTarget = connectionLookup.get(targetKey) || new Map();
    const connection = { edgeId: edge.id, source, target, sourceHandle, targetHandle };

    edgeLookup.set(edge.id, edge);
    connectionLookup.set(sourceKey, prevSource.set(`${target}-${targetHandle}`, connection));
    connectionLookup.set(targetKey, prevTarget.set(`${source}-${sourceHandle}`, connection));
  }
}

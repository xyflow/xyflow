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
  NodeChange,
  NodeLookup,
  Rect,
} from '../types';
import { getDimensions, getHandleBounds } from './dom';
import { getBoundsOfRects, getNodeDimensions, isNumeric, nodeToRect } from './general';
import { getNodePositionWithOrigin } from './graph';

export function updateAbsolutePositions<NodeType extends NodeBase>(
  nodeLookup: Map<string, InternalNodeBase<NodeType>>,
  options: UpdateNodesOptions<NodeType> = {
    nodeOrigin: [0, 0] as NodeOrigin,
    elevateNodesOnSelect: true,
    defaults: {},
  },
  parentNodeIds?: Set<string>
) {
  const selectedNodeZ: number = options?.elevateNodesOnSelect ? 1000 : 0;

  for (const [id, node] of nodeLookup) {
    const parentId = node.parentId;

    if (parentId && !nodeLookup.has(parentId)) {
      throw new Error(`Parent node ${parentId} not found`);
    }

    if (parentId || node.internals.isParent || parentNodeIds?.has(id)) {
      const parentNode = parentId ? nodeLookup.get(parentId) : null;
      const { x, y, z } = calculateXYZPosition(
        node,
        nodeLookup,
        {
          ...node.position,
          z: (isNumeric(node.zIndex) ? node.zIndex : 0) + (node.selected ? selectedNodeZ : 0),
        },
        parentNode?.origin || options.nodeOrigin
      );

      const currPosition = node.internals.positionAbsolute;
      const positionChanged = x !== currPosition.x || y !== currPosition.y;

      node.internals.positionAbsolute = positionChanged ? { x, y } : currPosition;
      node.internals.z = z;

      if (parentNodeIds !== undefined) {
        node.internals.isParent = !!parentNodeIds?.has(id);
      }

      nodeLookup.set(id, node);
    }
  }
}

type UpdateNodesOptions<NodeType extends NodeBase> = {
  nodeOrigin?: NodeOrigin;
  elevateNodesOnSelect?: boolean;
  defaults?: Partial<NodeType>;
};

export function adoptUserNodes<NodeType extends NodeBase>(
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
  const selectedNodeZ: number = options?.elevateNodesOnSelect ? 1000 : 0;
  const parentNodeIds = new Set<string>();

  nodes.forEach((userNode) => {
    const currentStoreNode = tmpLookup.get(userNode.id);

    if (userNode.parentId) {
      parentNodeIds.add(userNode.parentId);
    }

    if (userNode === currentStoreNode?.internals.userNode) {
      nodeLookup.set(userNode.id, currentStoreNode);
    } else {
      nodeLookup.set(userNode.id, {
        ...options.defaults,
        ...userNode,
        measured: {
          width: userNode.measured?.width,
          height: userNode.measured?.height,
        },
        internals: {
          positionAbsolute: userNode.position,
          handleBounds: currentStoreNode?.internals?.handleBounds,
          z: (isNumeric(userNode.zIndex) ? userNode.zIndex : 0) + (userNode.selected ? selectedNodeZ : 0),
          userNode,
          isParent: false,
        },
      });
    }
  });

  if (parentNodeIds.size > 0) {
    updateAbsolutePositions(nodeLookup, options, parentNodeIds);
  }
}

function calculateXYZPosition<NodeType extends NodeBase>(
  node: NodeType,
  nodeLookup: Map<string, InternalNodeBase<NodeType>>,
  result: XYZPosition,
  nodeOrigin: NodeOrigin = [0, 0]
): XYZPosition {
  if (!node.parentId) {
    return result;
  }

  const parentNode = nodeLookup.get(node.parentId)!;
  const { position: parentNodePosition } = getNodePositionWithOrigin(parentNode, parentNode?.origin || nodeOrigin);

  return calculateXYZPosition(
    parentNode,
    nodeLookup,
    {
      x: (result.x ?? 0) + parentNodePosition.x,
      y: (result.y ?? 0) + parentNodePosition.y,
      z: (parentNode.internals.z ?? 0) > (result.z ?? 0) ? parentNode.internals.z ?? 0 : result.z ?? 0,
    },
    parentNode.origin || nodeOrigin
  );
}

export function handleParentExpand(nodes: InternalNodeBase[], nodeLookup: NodeLookup): NodeChange[] {
  const changes: NodeChange[] = [];
  const chilNodeRects = new Map<string, Rect>();

  nodes.forEach((node) => {
    const parentId = node.parentId;
    if (node.expandParent && parentId) {
      const parentNode = nodeLookup.get(parentId);

      if (parentNode) {
        const parentRect = chilNodeRects.get(parentId) || nodeToRect(parentNode, node.origin);
        const expandedRect = getBoundsOfRects(parentRect, nodeToRect(node, node.origin));
        chilNodeRects.set(parentId, expandedRect);
      }
    }
  });

  if (chilNodeRects.size > 0) {
    chilNodeRects.forEach((rect, id) => {
      const origParent = nodeLookup.get(id)!;
      const { position } = getNodePositionWithOrigin(origParent, origParent.origin);
      const dimensions = getNodeDimensions(origParent);

      if (rect.x < position.x || rect.y < position.y) {
        const xChange = Math.round(Math.abs(position.x - rect.x));
        const yChange = Math.round(Math.abs(position.y - rect.y));

        changes.push({
          id,
          type: 'position',
          position: {
            x: position.x - xChange,
            y: position.y - yChange,
          },
        });

        changes.push({
          id,
          type: 'dimensions',
          resizing: true,
          dimensions: {
            width: dimensions.width + xChange,
            height: dimensions.height + yChange,
          },
        });

        // @todo we need to reset child node positions if < 0
      } else if (dimensions.width < rect.width || dimensions.height < rect.height) {
        changes.push({
          id,
          type: 'dimensions',
          resizing: true,
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
): NodeChange[] {
  const viewportNode = domNode?.querySelector('.xyflow__viewport');

  if (!viewportNode) {
    return [];
  }

  const changes: NodeChange[] = [];
  const style = window.getComputedStyle(viewportNode);
  const { m22: zoom } = new window.DOMMatrixReadOnly(style.transform);
  // in this array we collect nodes, that might trigger changes (like expanding parent)
  const triggerChangeNodes: NodeType[] = [];

  updates.forEach((update) => {
    const node = nodeLookup.get(update.id);

    if (node?.hidden) {
      nodeLookup.set(node.id, {
        ...node,
        internals: {
          ...node.internals,
          handleBounds: undefined,
        },
      });
    } else if (node) {
      const dimensions = getDimensions(update.nodeElement);
      const doUpdate = !!(
        dimensions.width &&
        dimensions.height &&
        (node.measured?.width !== dimensions.width ||
          node.measured?.height !== dimensions.height ||
          !node.internals.handleBounds ||
          update.force)
      );

      if (doUpdate) {
        const newNode = {
          ...node,
          measured: {
            ...node.measured,
            ...dimensions,
          },
          internals: {
            ...node.internals,
            handleBounds: {
              source: getHandleBounds('.source', update.nodeElement, zoom, node.origin || nodeOrigin),
              target: getHandleBounds('.target', update.nodeElement, zoom, node.origin || nodeOrigin),
            },
          },
        };

        nodeLookup.set(node.id, newNode);

        changes.push({
          id: newNode.id,
          type: 'dimensions',
          dimensions,
        });

        if (newNode.expandParent) {
          triggerChangeNodes.push(newNode);
        }
      }
    }
  });

  if (triggerChangeNodes.length > 0) {
    const parentExpandChanges = handleParentExpand(triggerChangeNodes, nodeLookup);
    changes.push(...parentExpandChanges);
  }

  return changes;
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

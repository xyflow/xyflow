import {
  NodeBase,
  CoordinateExtent,
  InternalNodeUpdate,
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
  NodeDimensionChange,
  NodePositionChange,
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
  parentLookup?: Map<string, InternalNodeBase<NodeType>[]>
) {
  const selectedNodeZ: number = options?.elevateNodesOnSelect ? 1000 : 0;

  for (const [id, node] of nodeLookup) {
    const parentId = node.parentId;

    if (parentId && !nodeLookup.has(parentId)) {
      throw new Error(`Parent node ${parentId} not found`);
    }

    if (parentId || node.internals.isParent || parentLookup?.has(id)) {
      const parentNode = parentId ? nodeLookup.get(parentId) : null;
      const { x, y, z } = calculateXYZPosition(
        node,
        nodeLookup,
        {
          ...node.position,
          z: (isNumeric(node.zIndex) ? node.zIndex : 0) + (node.selected ? selectedNodeZ : 0),
        },
        parentNode?.origin ?? options.nodeOrigin
      );

      const currPosition = node.internals.positionAbsolute;
      const positionChanged = x !== currPosition.x || y !== currPosition.y;

      node.internals = {
        ...node.internals,
        positionAbsolute: positionChanged ? { x, y } : currPosition,
        z,
      };

      if (parentLookup !== undefined) {
        node.internals.isParent = !!parentLookup.has(id);
      }
    }
  }
}

type UpdateNodesOptions<NodeType extends NodeBase> = {
  nodeOrigin?: NodeOrigin;
  elevateNodesOnSelect?: boolean;
  defaults?: Partial<NodeType>;
  checkEquality?: boolean;
};

export function adoptUserNodes<NodeType extends NodeBase>(
  nodes: NodeType[],
  nodeLookup: Map<string, InternalNodeBase<NodeType>>,
  parentLookup: Map<string, InternalNodeBase<NodeType>[]>,
  options: UpdateNodesOptions<NodeType> = {
    nodeOrigin: [0, 0] as NodeOrigin,
    elevateNodesOnSelect: true,
    defaults: {},
    checkEquality: true,
  }
) {
  const tmpLookup = new Map(nodeLookup);
  nodeLookup.clear();
  parentLookup.clear();

  const selectedNodeZ: number = options?.elevateNodesOnSelect ? 1000 : 0;
  // const parentNodeIds = new Set<string>();

  nodes.forEach((userNode) => {
    const currentStoreNode = tmpLookup.get(userNode.id);

    let internalNode = currentStoreNode!;
    if (options.checkEquality && userNode === currentStoreNode?.internals.userNode) {
      nodeLookup.set(userNode.id, currentStoreNode);
    } else {
      internalNode = {
        ...options.defaults,
        ...userNode,
        measured: {
          width: userNode.measured?.width,
          height: userNode.measured?.height,
        },
        internals: {
          positionAbsolute: userNode.position,
          handleBounds: currentStoreNode?.internals.handleBounds,
          z: (isNumeric(userNode.zIndex) ? userNode.zIndex : 0) + (userNode.selected ? selectedNodeZ : 0),
          userNode,
          isParent: false,
        },
      };
      nodeLookup.set(userNode.id, internalNode);
    }

    if (userNode.parentId) {
      const childNodes = parentLookup.get(userNode.parentId);
      if (childNodes) {
        childNodes.push(internalNode);
      } else {
        parentLookup.set(userNode.parentId, [internalNode]);
      }
    }
  });

  if (parentLookup.size > 0) {
    updateAbsolutePositions(nodeLookup, options, parentLookup);
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

type ExpandParentNode<NodeType> = NodeType & { parentId: string; expandParent: true };

export function handleParentExpand(
  nodes: ExpandParentNode<InternalNodeBase>[],
  nodeLookup: NodeLookup
): (NodeDimensionChange | NodePositionChange)[] {
  const changes: (NodeDimensionChange | NodePositionChange)[] = [];
  const chilNodeRects = new Map<string, Rect>();

  for (const node of nodes) {
    const parentNode = nodeLookup.get(node.parentId);
    if (!parentNode) {
      continue;
    }

    const parentRect = chilNodeRects.get(node.parentId) ?? nodeToRect(parentNode, node.origin);
    const expandedRect = getBoundsOfRects(parentRect, nodeToRect(node, node.origin));
    chilNodeRects.set(node.parentId, expandedRect);
  }

  if (chilNodeRects.size > 0) {
    chilNodeRects.forEach((rect, id) => {
      const origParent = nodeLookup.get(id)!;
      const { position } = getNodePositionWithOrigin(origParent, origParent.origin);
      const dimensions = getNodeDimensions(origParent);

      let xChange = rect.x < position.x ? Math.round(Math.abs(position.x - rect.x)) : 0;
      let yChange = rect.y < position.y ? Math.round(Math.abs(position.y - rect.y)) : 0;
      if (xChange > 0 || yChange > 0) {
        changes.push({
          id,
          type: 'position',
          position: {
            x: position.x - xChange,
            y: position.y - yChange,
          },
        });
      }

      if (dimensions.width < rect.width || dimensions.height < rect.height) {
        changes.push({
          id,
          type: 'dimensions',
          resizing: true,
          dimensions: {
            width: Math.max(dimensions.width, Math.round(rect.width)),
            height: Math.max(dimensions.height, Math.round(rect.height)),
          },
        });
      }
    });
  }

  return changes;
}

export function updateNodeInternals<NodeType extends InternalNodeBase>(
  updates: Map<string, InternalNodeUpdate>,
  nodeLookup: Map<string, NodeType>,
  domNode: HTMLElement | null,
  nodeOrigin?: NodeOrigin
): { changes: (NodeDimensionChange | NodePositionChange)[]; updatedInternals: boolean } {
  const viewportNode = domNode?.querySelector('.xyflow__viewport');
  let updatedInternals = false;

  if (!viewportNode) {
    return { changes: [], updatedInternals };
  }

  const changes: (NodeDimensionChange | NodePositionChange)[] = [];
  const style = window.getComputedStyle(viewportNode);
  const { m22: zoom } = new window.DOMMatrixReadOnly(style.transform);
  // in this array we collect nodes, that might trigger changes (like expanding parent)
  const parentExpandNodes: ExpandParentNode<NodeType>[] = [];

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
      updatedInternals = true;
    } else if (node) {
      const dimensions = getDimensions(update.nodeElement);
      const dimensionChanged = node.measured.width !== dimensions.width || node.measured.height !== dimensions.height;
      const doUpdate = !!(
        dimensions.width &&
        dimensions.height &&
        (dimensionChanged || !node.internals.handleBounds || update.force)
      );

      if (doUpdate) {
        const newNode = {
          ...node,
          measured: dimensions,
          internals: {
            ...node.internals,
            handleBounds: {
              source: getHandleBounds('.source', update.nodeElement, zoom, node.origin || nodeOrigin),
              target: getHandleBounds('.target', update.nodeElement, zoom, node.origin || nodeOrigin),
            },
          },
        };

        nodeLookup.set(node.id, newNode);
        updatedInternals = true;

        if (dimensionChanged) {
          changes.push({
            id: newNode.id,
            type: 'dimensions',
            dimensions,
          });

          if (newNode.expandParent && newNode.parentId) {
            parentExpandNodes.push(newNode as ExpandParentNode<NodeType>);
          }
        }
      }
    }
  });

  if (parentExpandNodes.length > 0) {
    const parentExpandChanges = handleParentExpand(parentExpandNodes, nodeLookup);
    changes.push(...parentExpandChanges);
  }

  return { changes, updatedInternals };
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

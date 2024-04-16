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
  ParentLookup,
} from '../types';
import { getDimensions, getHandleBounds } from './dom';
import { getBoundsOfRects, getNodeDimensions, isNumeric, nodeToRect } from './general';
import { getNodePositionWithOrigin } from './graph';
import { ParentExpandChild } from './types';

export function updateAbsolutePositions<NodeType extends NodeBase>(
  nodeLookup: Map<string, InternalNodeBase<NodeType>>,
  options: UpdateNodesOptions<NodeType> = {
    nodeOrigin: [0, 0] as NodeOrigin,
    elevateNodesOnSelect: true,
    defaults: {},
  }
) {
  const selectedNodeZ: number = options?.elevateNodesOnSelect ? 1000 : 0;

  for (const [, node] of nodeLookup) {
    const parentId = node.parentId;

    if (!parentId) {
      continue;
    }

    if (!nodeLookup.has(parentId)) {
      throw new Error(`Parent node ${parentId} not found`);
    }

    const parentNode = nodeLookup.get(parentId);
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

    if (positionChanged || z !== node.internals.z) {
      node.internals = {
        ...node.internals,
        positionAbsolute: positionChanged ? { x, y } : currPosition,
        z,
      };
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
    updateAbsolutePositions(nodeLookup, options);
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

export function handleExpandParent(
  children: ParentExpandChild[],
  nodeLookup: NodeLookup,
  parentLookup: ParentLookup,
  nodeOrigin?: NodeOrigin
): (NodeDimensionChange | NodePositionChange)[] {
  const changes: (NodeDimensionChange | NodePositionChange)[] = [];
  const parentExpansions = new Map<string, { expandedRect: Rect; parent: InternalNodeBase }>();

  // determine the expanded rectangle the child nodes would take for each parent
  for (const child of children) {
    const parent = nodeLookup.get(child.parentId);
    if (!parent) {
      continue;
    }

    const parentRect =
      parentExpansions.get(child.parentId)?.expandedRect ?? nodeToRect(parent, parent.origin ?? nodeOrigin);
    const expandedRect = getBoundsOfRects(parentRect, child.rect);
    parentExpansions.set(child.parentId, { expandedRect, parent });
  }

  if (parentExpansions.size > 0) {
    parentExpansions.forEach(({ expandedRect, parent }, parentId) => {
      // determine the position & dimensions of the parent
      const { position } = getNodePositionWithOrigin(parent, parent.origin);
      const dimensions = getNodeDimensions(parent);

      // determine how much the parent expands by moving the position
      let xChange = expandedRect.x < position.x ? Math.round(Math.abs(position.x - expandedRect.x)) : 0;
      let yChange = expandedRect.y < position.y ? Math.round(Math.abs(position.y - expandedRect.y)) : 0;
      if (xChange > 0 || yChange > 0) {
        changes.push({
          id: parentId,
          type: 'position',
          position: {
            x: position.x - xChange,
            y: position.y - yChange,
          },
        });

        // We move all child nodes in the oppsite direction
        // so the x,y changes of the parent do not move the children
        const childNodes = parentLookup.get(parentId);
        childNodes?.forEach((childNode) => {
          if (!children.some((child) => child.id === childNode.id)) {
            changes.push({
              id: childNode.id,
              type: 'position',
              position: {
                x: childNode.position.x + xChange,
                y: childNode.position.y + yChange,
              },
            });
          }
        });
      }

      if (dimensions.width < expandedRect.width || dimensions.height < expandedRect.height) {
        changes.push({
          id: parentId,
          type: 'dimensions',
          resizing: true,
          dimensions: {
            width: Math.max(dimensions.width, Math.round(expandedRect.width)),
            height: Math.max(dimensions.height, Math.round(expandedRect.height)),
          },
        });
      }
    });
  }

  return changes;
}

export function updateNodeInternals<NodeType extends InternalNodeBase>(
  updates: Map<string, InternalNodeUpdate>,
  nodeLookup: NodeLookup<NodeType>,
  parentLookup: ParentLookup<NodeType>,
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
  const parentExpandChildren: ParentExpandChild[] = [];

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
            parentExpandChildren.push({
              id: newNode.id,
              parentId: newNode.parentId,
              rect: nodeToRect(newNode, newNode.origin || nodeOrigin),
            });
          }
        }
      }
    }
  });

  if (parentExpandChildren.length > 0) {
    const parentExpandChanges = handleExpandParent(parentExpandChildren, nodeLookup, parentLookup, nodeOrigin);
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

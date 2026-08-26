import {
  dimensionChange,
  DimensionChange,
  type HandleBounds,
  type HandleConnection,
  infiniteExtent,
  type NodeHandleBounds,
  positionChange,
  PositionChange,
  type ZIndexMode,
} from '..';
import {
  type NodeBase,
  type CoordinateExtent,
  type InternalNodeUpdate,
  type NodeOrigin,
  type PanZoomInstance,
  type Transform,
  type XYPosition,
  type ConnectionLookup,
  type EdgeBase,
  type EdgeLookup,
  type InternalNodeBase,
  type NodeLookup,
  type Rect,
  type ParentLookup,
} from '../types';
import { getDimensions, getHandleBounds } from './dom';
import {
  clampPosition,
  clampPositionToParent,
  getBoundsOfRects,
  getNodeDimensions,
  isCoordinateExtent,
  isNumeric,
  nodeToRect,
} from './general';
import { getNodePositionWithOrigin } from './graph';
import { type ParentExpandChild } from './types';

const SELECTED_NODE_Z = 1000;
const ROOT_PARENT_Z_INCREMENT = 10;

const defaultOptions = {
  nodeOrigin: [0, 0] as NodeOrigin,
  nodeExtent: infiniteExtent,
  elevateNodesOnSelect: true,
  zIndexMode: 'basic' as ZIndexMode,
  defaults: {},
  checkEquality: true,
};

function mergeObjects<T extends Record<string, unknown>>(base: T, incoming?: Partial<T>): T {
  const result = { ...base };
  for (const key in incoming) {
    if (incoming[key] !== undefined) {
      // typecast is safe here, because we check for undefined
      result[key] = (incoming as T)[key]!;
    }
  }

  return result;
}

function parseHandles(userNode: NodeBase, internalNode?: InternalNodeBase): NodeHandleBounds | undefined {
  if (!userNode.handles) {
    return !userNode.measured || userNode.hidden ? undefined : internalNode?.internals.handleBounds;
  }

  const source: HandleBounds[] = [];
  const target: HandleBounds[] = [];

  for (const handle of userNode.handles) {
    const handleBounds = {
      id: handle.id,
      width: handle.width ?? 1,
      height: handle.height ?? 1,
      nodeId: userNode.id,
      x: handle.x,
      y: handle.y,
      position: handle.position,
      type: handle.type,
    };
    if (handle.type === 'source') {
      source.push(handleBounds);
    } else if (handle.type === 'target') {
      target.push(handleBounds);
    }
  }

  return {
    source,
    target,
  };
}

type UpdateNodesOptions<NodeType extends NodeBase> = {
  nodeOrigin?: NodeOrigin;
  nodeExtent?: CoordinateExtent;
  elevateNodesOnSelect?: boolean;
  defaults?: Partial<NodeType>;
  zIndexMode?: ZIndexMode;
  checkEquality?: boolean;
};

function isManualZIndexMode(zIndexMode?: ZIndexMode): boolean {
  return zIndexMode === 'manual';
}

type SubflowContext<NodeType extends NodeBase> = {
  nodeLookup: NodeLookup<InternalNodeBase<NodeType>>;
  parentLookup: ParentLookup<InternalNodeBase<NodeType>>;
  options: Required<UpdateNodesOptions<NodeType>>;
  rootParentIndex: { i: number };
  processedNodes: Set<string>;
  deferredChildNodes: Map<string, InternalNodeBase<NodeType>[]>;
};

export function adoptUserNodes<NodeType extends NodeBase>(
  nodes: NodeType[],
  nodeLookup: NodeLookup<InternalNodeBase<NodeType>>,
  parentLookup: ParentLookup<InternalNodeBase<NodeType>>,
  _options: UpdateNodesOptions<NodeType> = {}
) {
  const options = mergeObjects(defaultOptions, _options);
  const rootParentIndex = { i: 0 };
  const tmpLookup = new Map(nodeLookup);
  const selectedNodeZ: number =
    options.elevateNodesOnSelect && !isManualZIndexMode(options.zIndexMode) ? SELECTED_NODE_Z : 0;
  // We track the nodes that already have been processed (relevant for subflows)
  const processedNodes = new Set<string>();
  // Deferred child nodes are grouped by the parent id they are waiting for
  const deferredChildNodes = new Map<string, InternalNodeBase<NodeType>[]>();
  let nodesInitialized = nodes.length > 0;
  let hasSelectedNodes = false;

  nodeLookup.clear();
  parentLookup.clear();

  const subflowContext: SubflowContext<NodeType> = {
    nodeLookup,
    parentLookup,
    options,
    rootParentIndex,
    processedNodes,
    deferredChildNodes,
  };

  for (const userNode of nodes) {
    let internalNode = tmpLookup.get(userNode.id);

    if (options.checkEquality && userNode === internalNode?.internals.userNode) {
      nodeLookup.set(userNode.id, internalNode);
    } else {
      const positionWithOrigin = getNodePositionWithOrigin(userNode, options.nodeOrigin);
      const extent = isCoordinateExtent(userNode.extent) ? userNode.extent : options.nodeExtent;
      const clampedPosition = clampPosition(positionWithOrigin, extent, getNodeDimensions(userNode));

      internalNode = {
        ...options.defaults,
        ...userNode,
        measured: {
          width: userNode.measured?.width,
          height: userNode.measured?.height,
        },
        internals: {
          positionAbsolute: clampedPosition,
          // if user re-initializes the node or removes `measured` for whatever reason, we reset the handleBounds so that the node gets re-measured
          handleBounds: parseHandles(userNode, internalNode),
          z: calculateZ(userNode, selectedNodeZ, options.zIndexMode),
          userNode,
        },
      };

      nodeLookup.set(userNode.id, internalNode);
    }

    if (
      (internalNode.measured === undefined ||
        internalNode.measured.width === undefined ||
        internalNode.measured.height === undefined) &&
      !internalNode.hidden
    ) {
      nodesInitialized = false;
    }

    resolveSubflowsForNode(internalNode, subflowContext);

    hasSelectedNodes ||= userNode.selected ?? false;
  }

  if (process.env.NODE_ENV === 'development') {
    // Any deferred child node which has not been processed yet is missing a parent node
    for (const childNodes of deferredChildNodes.values()) {
      childNodes.forEach((childNode) => {
        console.warn(`Parent node with id "${childNode.parentId}" is missing for child node with id "${childNode.id}"`);
      });
    }
  }

  return { nodesInitialized, hasSelectedNodes };
}

function resolveSubflowsForNode<NodeType extends NodeBase>(
  node: InternalNodeBase<NodeType>,
  context: SubflowContext<NodeType>
) {
  const { processedNodes, deferredChildNodes } = context;

  // The parent may appear later in the nodes array or may itself still be deferred.
  if (node.parentId && !processedNodes.has(node.parentId)) {
    const children = deferredChildNodes.get(node.parentId) ?? [];
    children.push(node);
    deferredChildNodes.set(node.parentId, children);
    return;
  }

  if (node.parentId) {
    updateChildNode(node, context);
  }

  processedNodes.add(node.id);

  // Processing this node may unblock multiple generations of descendants.
  const children = deferredChildNodes.get(node.id);
  if (children) {
    deferredChildNodes.delete(node.id);
    children.forEach((child) => resolveSubflowsForNode(child, context));
  }
}

function updateParentLookup<NodeType extends NodeBase>(
  node: InternalNodeBase<NodeType>,
  parentLookup: ParentLookup<InternalNodeBase<NodeType>>
) {
  if (!node.parentId) {
    return;
  }

  const childNodes = parentLookup.get(node.parentId);

  if (childNodes) {
    childNodes.set(node.id, node);
  } else {
    parentLookup.set(node.parentId, new Map([[node.id, node]]));
  }
}

/**
 * Updates positionAbsolute and zIndex of a child node and the parentLookup.
 */
function updateChildNode<NodeType extends NodeBase>(
  node: InternalNodeBase<NodeType>,
  context: SubflowContext<NodeType>
) {
  const { nodeLookup, parentLookup, rootParentIndex } = context;
  const parentId = node.parentId!;
  const parentNode = nodeLookup.get(parentId);

  if (!parentNode) {
    console.warn(`Parent node ${parentId} not found.`);
    return;
  }

  // We just want to set the rootParentIndex for the first child
  if (
    rootParentIndex &&
    !parentNode.parentId &&
    parentNode.internals.rootParentIndex === undefined &&
    context.options.zIndexMode === 'auto'
  ) {
    parentNode.internals.rootParentIndex = ++rootParentIndex.i;
    parentNode.internals.z = parentNode.internals.z + rootParentIndex.i * ROOT_PARENT_Z_INCREMENT;
  }

  // But we need to update rootParentIndex.i also when parent has not been updated
  if (rootParentIndex && parentNode.internals.rootParentIndex !== undefined) {
    rootParentIndex.i = parentNode.internals.rootParentIndex;
  }

  const updatedNode = updateChildXYZ(node, parentNode, context);
  updateParentLookup(updatedNode, parentLookup);
}

/**
 * Updates positionAbsolute and zIndex of a child node and the parentLookup.
 */
function updateChildXYZ<NodeType extends NodeBase>(
  node: InternalNodeBase<NodeType>,
  parentNode: InternalNodeBase<NodeType>,
  context: {
    nodeLookup: NodeLookup<InternalNodeBase<NodeType>>;
    options: Required<UpdateNodesOptions<NodeType>>;
  }
) {
  const { elevateNodesOnSelect, nodeOrigin, nodeExtent, zIndexMode } = context.options;

  const selectedNodeZ = elevateNodesOnSelect && !isManualZIndexMode(zIndexMode) ? SELECTED_NODE_Z : 0;
  const { x, y, z } = calculateChildXYZ(node, parentNode, nodeOrigin, nodeExtent, selectedNodeZ, zIndexMode);
  const { positionAbsolute } = node.internals;
  const positionChanged = x !== positionAbsolute.x || y !== positionAbsolute.y;

  if (positionChanged || z !== node.internals.z) {
    // we create a new object to mark the node as updated
    const newNode = {
      ...node,
      internals: {
        ...node.internals,
        positionAbsolute: positionChanged ? { x, y } : positionAbsolute,
        z,
      },
    };
    context.nodeLookup.set(node.id, newNode);
    return newNode;
  }
  return node;
}

function calculateZ(node: NodeBase, selectedNodeZ: number, zIndexMode: ZIndexMode): number {
  const zIndex = isNumeric(node.zIndex) ? node.zIndex : 0;

  if (isManualZIndexMode(zIndexMode)) {
    return zIndex;
  }

  return zIndex + (node.selected ? selectedNodeZ : 0);
}

function calculateChildXYZ<NodeType extends NodeBase>(
  childNode: InternalNodeBase<NodeType>,
  parentNode: InternalNodeBase<NodeType>,
  nodeOrigin: NodeOrigin,
  nodeExtent: CoordinateExtent,
  selectedNodeZ: number,
  zIndexMode: ZIndexMode
) {
  const { x: parentX, y: parentY } = parentNode.internals.positionAbsolute;
  const childDimensions = getNodeDimensions(childNode);
  const positionWithOrigin = getNodePositionWithOrigin(childNode, nodeOrigin);
  const clampedPosition = isCoordinateExtent(childNode.extent)
    ? clampPosition(positionWithOrigin, childNode.extent, childDimensions)
    : positionWithOrigin;

  let absolutePosition = clampPosition(
    { x: parentX + clampedPosition.x, y: parentY + clampedPosition.y },
    nodeExtent,
    childDimensions
  );

  if (childNode.extent === 'parent') {
    absolutePosition = clampPositionToParent(absolutePosition, childDimensions, parentNode);
  }

  const childZ = calculateZ(childNode, selectedNodeZ, zIndexMode);
  const parentZ = parentNode.internals.z ?? 0;

  return {
    x: absolutePosition.x,
    y: absolutePosition.y,
    z: parentZ >= childZ ? parentZ + 1 : childZ,
  };
}

export function handleExpandParent(
  children: ParentExpandChild[],
  nodeLookup: NodeLookup,
  parentLookup: ParentLookup,
  nodeOrigin: NodeOrigin = [0, 0]
): (DimensionChange | PositionChange)[] {
  const changes: (DimensionChange | PositionChange)[] = [];
  const parentExpansions = new Map<string, { expandedRect: Rect; parent: InternalNodeBase }>();

  // determine the expanded rectangle the child nodes would take for each parent
  for (const child of children) {
    const parent = nodeLookup.get(child.parentId);
    if (!parent) {
      continue;
    }

    const parentRect = parentExpansions.get(child.parentId)?.expandedRect ?? nodeToRect(parent);
    const expandedRect = getBoundsOfRects(parentRect, child.rect);

    parentExpansions.set(child.parentId, { expandedRect, parent });
  }

  if (parentExpansions.size > 0) {
    parentExpansions.forEach(({ expandedRect, parent }, parentId) => {
      // determine the position & dimensions of the parent
      const positionAbsolute = parent.internals.positionAbsolute;
      const dimensions = getNodeDimensions(parent);
      const origin = parent.origin ?? nodeOrigin;

      // determine how much the parent expands in width and position
      const xChange =
        expandedRect.x < positionAbsolute.x ? Math.round(Math.abs(positionAbsolute.x - expandedRect.x)) : 0;
      const yChange =
        expandedRect.y < positionAbsolute.y ? Math.round(Math.abs(positionAbsolute.y - expandedRect.y)) : 0;

      const newWidth = Math.max(dimensions.width, Math.round(expandedRect.width));
      const newHeight = Math.max(dimensions.height, Math.round(expandedRect.height));

      const widthChange = (newWidth - dimensions.width) * origin[0];
      const heightChange = (newHeight - dimensions.height) * origin[1];

      // We need to correct the position of the parent node if the origin is not [0,0]
      if (xChange > 0 || yChange > 0 || widthChange || heightChange) {
        changes.push(
          positionChange(parentId, {
            x: parent.position.x - xChange + widthChange,
            y: parent.position.y - yChange + heightChange,
          })
        );

        /*
         * We move all child nodes in the oppsite direction
         * so the x,y changes of the parent do not move the children
         */
        parentLookup.get(parentId)?.forEach((childNode) => {
          if (!children.some((child) => child.id === childNode.id)) {
            changes.push(
              positionChange(childNode.id, {
                x: childNode.position.x + xChange,
                y: childNode.position.y + yChange,
              })
            );
          }
        });
      }

      // We need to correct the dimensions of the parent node if the origin is not [0,0]
      if (dimensions.width < expandedRect.width || dimensions.height < expandedRect.height || xChange || yChange) {
        changes.push({
          id: parentId,
          type: 'dimensions',
          setAttributes: true,
          dimensions: {
            width: newWidth + (xChange ? origin[0] * xChange - widthChange : 0),
            height: newHeight + (yChange ? origin[1] * yChange - heightChange : 0),
          },
        });
      }
    });
  }

  return changes;
}

type UpdateInternalsContext<NodeType extends NodeBase> = {
  nodeLookup: NodeLookup<InternalNodeBase<NodeType>>;
  parentLookup: ParentLookup<InternalNodeBase<NodeType>>;
  updates: Map<string, InternalNodeUpdate>;
  zoom: number;
  options: Required<UpdateNodesOptions<NodeType>>;
  changes: (DimensionChange | PositionChange)[];
  parentExpandChildren: ParentExpandChild[];
  updatedInternals: boolean;
};

export function updateNodeInternals<NodeType extends NodeBase>(
  updates: Map<string, InternalNodeUpdate>,
  nodeLookup: NodeLookup<InternalNodeBase<NodeType>>,
  parentLookup: ParentLookup<InternalNodeBase<NodeType>>,
  domNode: HTMLElement | null,
  nodeOrigin?: NodeOrigin,
  nodeExtent?: CoordinateExtent,
  zIndexMode?: ZIndexMode
): { changes: (DimensionChange | PositionChange)[]; updatedInternals: boolean } {
  const viewportNode = domNode?.querySelector('.xyflow__viewport');

  if (!viewportNode) {
    return { changes: [], updatedInternals: false };
  }

  const changes: (DimensionChange | PositionChange)[] = [];
  const style = window.getComputedStyle(viewportNode);
  const { m22: zoom } = new window.DOMMatrixReadOnly(style.transform);
  // in this array we collect nodes, that might trigger changes (like expanding parent)
  const parentExpandChildren: ParentExpandChild[] = [];

  const context: UpdateInternalsContext<NodeType> = {
    nodeLookup,
    parentLookup,
    zoom,
    changes,
    updates,
    parentExpandChildren,
    options: mergeObjects(defaultOptions, { nodeOrigin, nodeExtent, zIndexMode }),
    updatedInternals: false,
  };

  for (const update of updates.values()) {
    const node = nodeLookup.get(update.id);
    if (!node) {
      continue;
    }

    // if the node has a parent it will be updated via walkChildren later
    if (node.parentId) {
      continue;
    }

    const updatedNode = updateInternals(node, update, context);

    walkChildren(updatedNode, context);
  }

  if (parentExpandChildren.length > 0) {
    const parentExpandChanges = handleExpandParent(parentExpandChildren, nodeLookup, parentLookup, nodeOrigin);
    changes.push(...parentExpandChanges);
  }

  return { changes, updatedInternals: context.updatedInternals };
}

function updateInternals<NodeType extends NodeBase>(
  node: InternalNodeBase<NodeType>,
  update: InternalNodeUpdate,
  context: UpdateInternalsContext<NodeType>
): InternalNodeBase<NodeType> {
  const { nodeLookup, updates, changes, parentExpandChildren, zoom } = context;
  const { nodeOrigin, nodeExtent } = context.options;

  if (node.hidden) {
    updates.delete(node.id);
    context.updatedInternals = true;
    return node;
  }

  const dimensions = getDimensions(update.nodeElement);
  const dimensionChanged = node.measured.width !== dimensions.width || node.measured.height !== dimensions.height;
  const doUpdate = !!(
    dimensions.width &&
    dimensions.height &&
    (dimensionChanged || !node.internals.handleBounds || update.force)
  );

  let updatedNode: InternalNodeBase<NodeType> = node;

  if (doUpdate) {
    const nodeBounds = update.nodeElement.getBoundingClientRect();
    const extent = isCoordinateExtent(node.extent) ? node.extent : nodeExtent;
    let { positionAbsolute } = node.internals;

    if (node.parentId && node.extent === 'parent') {
      const parentNode = nodeLookup.get(node.parentId);
      if (parentNode) {
        positionAbsolute = clampPositionToParent(positionAbsolute, dimensions, parentNode);
      }
    } else if (extent) {
      positionAbsolute = clampPosition(positionAbsolute, extent, dimensions);
    }

    updatedNode = {
      ...node,
      measured: dimensions,
      internals: {
        ...node.internals,
        positionAbsolute,
        handleBounds: {
          source: getHandleBounds('source', update.nodeElement, nodeBounds, zoom, node.id),
          target: getHandleBounds('target', update.nodeElement, nodeBounds, zoom, node.id),
        },
      },
    };

    context.nodeLookup.set(node.id, updatedNode);

    context.updatedInternals = true;
    // by deleting the update we prevent the node from being updated again
    updates.delete(node.id);

    if (dimensionChanged) {
      changes.push(dimensionChange(node.id, dimensions));

      if (node.expandParent && node.parentId) {
        parentExpandChildren.push({
          id: node.id,
          parentId: node.parentId,
          rect: nodeToRect(updatedNode, nodeOrigin),
        });
      }
    }

    walkChildren(updatedNode, context);
  }

  return updatedNode;
}

function walkChildren<NodeType extends NodeBase>(
  node: InternalNodeBase<NodeType>,
  context: UpdateInternalsContext<NodeType>
) {
  const { parentLookup, updates } = context;
  const children = parentLookup.get(node.id);
  if (children) {
    for (const child of children.values()) {
      const childUpdate = updates.get(child.id);
      if (!childUpdate) {
        continue;
      }
      const updatedChild = updateInternals(child, childUpdate, context);
      updateChildXYZ(updatedChild, node, context);
    }
  }
}

export async function panBy({
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
}): Promise<boolean> {
  if (!panZoom || (!delta.x && !delta.y)) {
    return false;
  }

  const nextViewport = await panZoom.setViewportConstrained(
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

/**
 * this function adds the connection to the connectionLookup
 * at the following keys: nodeId-type-handleId, nodeId-type and nodeId
 * @param type type of the connection
 * @param connection connection that should be added to the lookup
 * @param connectionKey at which key the connection should be added
 * @param connectionLookup reference to the connection lookup
 * @param nodeId nodeId of the connection
 * @param handleId handleId of the connection
 */
function addConnectionToLookup(
  type: 'source' | 'target',
  connection: HandleConnection,
  connectionKey: string,
  connectionLookup: ConnectionLookup,
  nodeId: string,
  handleId: string | null
) {
  /*
   * We add the connection to the connectionLookup at the following keys
   * 1. nodeId, 2. nodeId-type, 3. nodeId-type-handleId
   * If the key already exists, we add the connection to the existing map
   */
  let key = nodeId;
  const nodeMap = connectionLookup.get(key) || new Map<string, HandleConnection>();
  connectionLookup.set(key, nodeMap.set(connectionKey, connection));

  key = `${nodeId}-${type}`;
  const typeMap = connectionLookup.get(key) || new Map<string, HandleConnection>();
  connectionLookup.set(key, typeMap.set(connectionKey, connection));

  if (handleId) {
    key = `${nodeId}-${type}-${handleId}`;
    const handleMap = connectionLookup.get(key) || new Map<string, HandleConnection>();
    connectionLookup.set(key, handleMap.set(connectionKey, connection));
  }
}

export function updateConnectionLookup(connectionLookup: ConnectionLookup, edgeLookup: EdgeLookup, edges: EdgeBase[]) {
  connectionLookup.clear();
  edgeLookup.clear();

  for (const edge of edges) {
    const { source: sourceNode, target: targetNode, sourceHandle = null, targetHandle = null } = edge;

    const connection = { edgeId: edge.id, source: sourceNode, target: targetNode, sourceHandle, targetHandle };
    const sourceKey = `${sourceNode}-${sourceHandle}--${targetNode}-${targetHandle}`;
    const targetKey = `${targetNode}-${targetHandle}--${sourceNode}-${sourceHandle}`;

    addConnectionToLookup('source', connection, targetKey, connectionLookup, sourceNode, sourceHandle);
    addConnectionToLookup('target', connection, sourceKey, connectionLookup, targetNode, targetHandle);

    edgeLookup.set(edge.id, edge);
  }
}

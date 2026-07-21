import { type Handle, type HandleConnection, infiniteExtent, type NodeHandleBounds, type ZIndexMode } from '..';
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
  type NodeDimensionChange,
  type NodePositionChange,
  type ParentLookup,
} from '../types';
import { getDimensions, getHandleBounds } from './dom';
import {
  clampPosition,
  clampPositionToParent,
  getNodeDimensions,
  isCoordinateExtent,
  isNumeric,
} from './general';
import { getNodePositionWithOrigin } from './graph';

const SELECTED_NODE_Z = 1000;
const ROOT_PARENT_Z_INCREMENT = 10;

const defaultOptions = {
  nodeOrigin: [0, 0] as NodeOrigin,
  nodeExtent: infiniteExtent,
  elevateNodesOnSelect: true,
  zIndexMode: 'basic' as ZIndexMode,
  defaults: {},
};

const adoptUserNodesDefaultOptions = {
  ...defaultOptions,
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

export function updateAbsolutePositions<NodeType extends NodeBase>(
  nodeLookup: NodeLookup<InternalNodeBase<NodeType>>,
  parentLookup: ParentLookup<InternalNodeBase<NodeType>>,
  options?: UpdateNodesOptions<NodeType>
) {
  const _options = mergeObjects(defaultOptions, options);
  for (const node of nodeLookup.values()) {
    if (node.parentId) {
      updateChildNode(node, nodeLookup, parentLookup, _options);
    } else {
      const positionWithOrigin = getNodePositionWithOrigin(node, _options.nodeOrigin);
      const extent = isCoordinateExtent(node.extent) ? node.extent : _options.nodeExtent;
      const clampedPosition = clampPosition(positionWithOrigin, extent, getNodeDimensions(node));
      node.internals.positionAbsolute = clampedPosition;
    }
  }
}

function parseHandles(userNode: NodeBase, internalNode?: InternalNodeBase): NodeHandleBounds | undefined {
  if (!userNode.handles) {
    return !userNode.measured ? undefined : internalNode?.internals.handleBounds;
  }

  const source: Handle[] = [];
  const target: Handle[] = [];

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

export function isManualZIndexMode(zIndexMode?: ZIndexMode): boolean {
  return zIndexMode === 'manual';
}

type AdoptUserNodesReturn = {
  nodesInitialized: boolean;
  hasSelectedNodes: boolean;
};

export function adoptUserNodes<NodeType extends NodeBase>(
  nodes: NodeType[],
  nodeLookup: NodeLookup<InternalNodeBase<NodeType>>,
  parentLookup: ParentLookup<InternalNodeBase<NodeType>>,
  options: UpdateNodesOptions<NodeType> = {}
): AdoptUserNodesReturn {
  const _options = mergeObjects(adoptUserNodesDefaultOptions, options);
  const rootParentIndex = { i: 0 };
  const tmpLookup = new Map(nodeLookup);
  const selectedNodeZ: number =
    _options?.elevateNodesOnSelect && !isManualZIndexMode(_options.zIndexMode) ? SELECTED_NODE_Z : 0;
  let nodesInitialized = nodes.length > 0;
  let hasSelectedNodes = false;

  nodeLookup.clear();
  parentLookup.clear();

  for (const userNode of nodes) {
    let internalNode = tmpLookup.get(userNode.id);

    if (_options.checkEquality && userNode === internalNode?.internals.userNode) {
      nodeLookup.set(userNode.id, internalNode);
    } else {
      const positionWithOrigin = getNodePositionWithOrigin(userNode, _options.nodeOrigin);
      const extent = isCoordinateExtent(userNode.extent) ? userNode.extent : _options.nodeExtent;
      const clampedPosition = clampPosition(positionWithOrigin, extent, getNodeDimensions(userNode));

      internalNode = {
        ..._options.defaults,
        ...userNode,
        measured: {
          width: userNode.measured?.width,
          height: userNode.measured?.height,
        },
        internals: {
          positionAbsolute: clampedPosition,
          // if user re-initializes the node or removes `measured` for whatever reason, we reset the handleBounds so that the node gets re-measured
          handleBounds: parseHandles(userNode, internalNode),
          z: calculateZ(userNode, selectedNodeZ, _options.zIndexMode),
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

    if (userNode.parentId) {
      updateChildNode(internalNode, nodeLookup, parentLookup, options, rootParentIndex);
    }

    hasSelectedNodes ||= userNode.selected ?? false;
  }

  return { nodesInitialized, hasSelectedNodes };
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
  nodeLookup: NodeLookup<InternalNodeBase<NodeType>>,
  parentLookup: ParentLookup<InternalNodeBase<NodeType>>,
  options: UpdateNodesOptions<NodeType>,
  rootParentIndex?: { i: number }
) {
  const { elevateNodesOnSelect, nodeOrigin, nodeExtent, zIndexMode } = mergeObjects(defaultOptions, options);
  const parentId = node.parentId!;
  const parentNode = nodeLookup.get(parentId);

  if (!parentNode) {
    console.warn(
      `Parent node ${parentId} not found. Please make sure that parent nodes are in front of their child nodes in the nodes array.`
    );
    return;
  }

  updateParentLookup(node, parentLookup);

  // We just want to set the rootParentIndex for the first child
  if (
    rootParentIndex &&
    !parentNode.parentId &&
    parentNode.internals.rootParentIndex === undefined &&
    zIndexMode === 'auto'
  ) {
    parentNode.internals.rootParentIndex = ++rootParentIndex.i;
    parentNode.internals.z = parentNode.internals.z + rootParentIndex.i * ROOT_PARENT_Z_INCREMENT;
  }

  // But we need to update rootParentIndex.i also when parent has not been updated
  if (rootParentIndex && parentNode.internals.rootParentIndex !== undefined) {
    rootParentIndex.i = parentNode.internals.rootParentIndex;
  }

  const selectedNodeZ = elevateNodesOnSelect && !isManualZIndexMode(zIndexMode) ? SELECTED_NODE_Z : 0;
  const { x, y, z } = calculateChildXYZ(node, parentNode, nodeOrigin, nodeExtent, selectedNodeZ, zIndexMode);
  const { positionAbsolute } = node.internals;
  const positionChanged = x !== positionAbsolute.x || y !== positionAbsolute.y;

  if (positionChanged || z !== node.internals.z) {
    // we create a new object to mark the node as updated
    nodeLookup.set(node.id, {
      ...node,
      internals: {
        ...node.internals,
        positionAbsolute: positionChanged ? { x, y } : positionAbsolute,
        z,
      },
    });
  }
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

export function updateNodeInternals<NodeType extends InternalNodeBase>(
  updates: Map<string, InternalNodeUpdate>,
  nodeLookup: NodeLookup<NodeType>,
  parentLookup: ParentLookup<NodeType>,
  domNode: HTMLElement | null,
  nodeOrigin?: NodeOrigin,
  nodeExtent?: CoordinateExtent,
  zIndexMode?: ZIndexMode
): { changes: (NodeDimensionChange | NodePositionChange)[]; updatedInternals: boolean } {
  const viewportNode = domNode?.querySelector('.xyflow__viewport');
  let updatedInternals = false;

  if (!viewportNode) {
    return { changes: [], updatedInternals };
  }

  const changes: (NodeDimensionChange | NodePositionChange)[] = [];
  const style = window.getComputedStyle(viewportNode);
  const { m22: zoom } = new window.DOMMatrixReadOnly(style.transform);

  for (const update of updates.values()) {
    const node = nodeLookup.get(update.id);
    if (!node) {
      continue;
    }

    if (node.hidden) {
      nodeLookup.set(node.id, {
        ...node,
        internals: {
          ...node.internals,
          handleBounds: undefined,
        },
      });
      updatedInternals = true;
      continue;
    }

    const dimensions = getDimensions(update.nodeElement);
    const dimensionChanged = node.measured.width !== dimensions.width || node.measured.height !== dimensions.height;
    const doUpdate = !!(
      dimensions.width &&
      dimensions.height &&
      (dimensionChanged || !node.internals.handleBounds || update.force)
    );

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

      const newNode = {
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

      nodeLookup.set(node.id, newNode);

      if (node.parentId) {
        updateChildNode(newNode, nodeLookup, parentLookup, { nodeOrigin, zIndexMode });
      }

      updatedInternals = true;

      if (dimensionChanged) {
        changes.push({
          id: node.id,
          type: 'dimensions',
          dimensions,
        });
      }
    }
  }

  return { changes, updatedInternals };
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

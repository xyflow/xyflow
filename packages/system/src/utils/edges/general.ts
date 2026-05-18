import { Connection, InternalNodeBase, Transform, errorMessages, isEdgeBase, EdgeBase, ZIndexMode } from '../..';
import { getOverlappingArea, boxToRect, nodeToBox, getBoundsOfBoxes, devWarn } from '../general';

// this is used for straight edges and simple smoothstep edges (LTR, RTL, BTT, TTB)
export function getEdgeCenter({
  sourceX,
  sourceY,
  targetX,
  targetY,
}: {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
}): [number, number, number, number] {
  const xOffset = Math.abs(targetX - sourceX) / 2;
  const centerX = targetX < sourceX ? targetX + xOffset : targetX - xOffset;

  const yOffset = Math.abs(targetY - sourceY) / 2;
  const centerY = targetY < sourceY ? targetY + yOffset : targetY - yOffset;

  return [centerX, centerY, xOffset, yOffset];
}

export type GetEdgeZIndexParams = {
  sourceNode: InternalNodeBase;
  targetNode: InternalNodeBase;
  selected?: boolean;
  zIndex?: number;
  elevateOnSelect?: boolean;
  zIndexMode?: ZIndexMode;
};

/**
 * Returns the z-index for an edge based on the node it connects and whether it is selected.
 * By default, edges are rendered below nodes. This behaviour is different for edges that are
 * connected to nodes with a parent, as they are rendered above the parent node.
 */
export function getElevatedEdgeZIndex({
  sourceNode,
  targetNode,
  selected = false,
  zIndex = 0,
  elevateOnSelect = false,
  zIndexMode = 'basic',
}: GetEdgeZIndexParams): number {
  if (zIndexMode === 'manual') {
    return zIndex;
  }

  const edgeZ = elevateOnSelect && selected ? zIndex + 1000 : zIndex;
  const nodeZ = Math.max(
    sourceNode.parentId || (elevateOnSelect && sourceNode.selected) ? sourceNode.internals.z : 0,
    targetNode.parentId || (elevateOnSelect && targetNode.selected) ? targetNode.internals.z : 0
  );

  return edgeZ + nodeZ;
}

type IsEdgeVisibleParams = {
  sourceNode: InternalNodeBase;
  targetNode: InternalNodeBase;
  width: number;
  height: number;
  transform: Transform;
};

export function isEdgeVisible({ sourceNode, targetNode, width, height, transform }: IsEdgeVisibleParams): boolean {
  const edgeBox = getBoundsOfBoxes(nodeToBox(sourceNode), nodeToBox(targetNode));

  if (edgeBox.x === edgeBox.x2) {
    edgeBox.x2 += 1;
  }

  if (edgeBox.y === edgeBox.y2) {
    edgeBox.y2 += 1;
  }

  const viewRect = {
    x: -transform[0] / transform[2],
    y: -transform[1] / transform[2],
    width: width / transform[2],
    height: height / transform[2],
  };

  return getOverlappingArea(viewRect, boxToRect(edgeBox)) > 0;
}

/**
 * Type for a custom edge ID generator function.
 * @public
 */
export type GetEdgeId = (params: Connection | EdgeBase) => string;

/**
 * The default edge ID generator function. Generates an ID based on the source, target, and handles.
 * @public
 * @param params - The connection or edge to generate an ID for.
 * @returns The generated edge ID.
 */
export const getEdgeId = ({ source, sourceHandle, target, targetHandle }: Connection | EdgeBase): string =>
  `xy-edge__${source}${sourceHandle || ''}-${target}${targetHandle || ''}`;

const connectionExists = (edge: EdgeBase, edges: EdgeBase[]) => {
  return edges.some(
    (el) =>
      el.source === edge.source &&
      el.target === edge.target &&
      (el.sourceHandle === edge.sourceHandle || (!el.sourceHandle && !edge.sourceHandle)) &&
      (el.targetHandle === edge.targetHandle || (!el.targetHandle && !edge.targetHandle))
  );
};

export type AddEdgeOptions = {
  /**
   * Custom function to generate edge IDs. If not provided, the default `getEdgeId` function is used.
   */
  getEdgeId?: GetEdgeId;
};

/**
 * This util is a convenience function to add a new Edge to an array of edges. It also performs some validation to make sure you don't add an invalid edge or duplicate an existing one.
 * @public
 * @param edgeParams - Either an `Edge` or a `Connection` you want to add.
 * @param edges - The array of all current edges.
 * @param options - Optional configuration object.
 * @returns A new array of edges with the new edge added.
 *
 * @remarks If an edge with the same `target` and `source` already exists (and the same
 *`targetHandle` and `sourceHandle` if those are set), then this util won't add
 *a new edge even if the `id` property is different.
 *
 */
export const addEdge = <EdgeType extends EdgeBase>(
  edgeParams: EdgeType | Connection,
  edges: EdgeType[],
  options: AddEdgeOptions = {}
): EdgeType[] => {
  if (!edgeParams.source || !edgeParams.target) {
    devWarn('006', errorMessages['error006']());

    return edges;
  }

  const edgeIdGenerator = options.getEdgeId || getEdgeId;

  let edge: EdgeType;
  if (isEdgeBase(edgeParams)) {
    edge = { ...edgeParams };
  } else {
    edge = {
      ...edgeParams,
      id: edgeIdGenerator(edgeParams),
    } as EdgeType;
  }

  if (connectionExists(edge, edges)) {
    return edges;
  }

  if (edge.sourceHandle === null) {
    delete edge.sourceHandle;
  }

  if (edge.targetHandle === null) {
    delete edge.targetHandle;
  }

  return edges.concat(edge);
};

export type ReconnectEdgeOptions = {
  /**
   * Should the id of the old edge be replaced with the new connection id.
   * @default true
   */
  shouldReplaceId?: boolean;
  /**
   * Custom function to generate edge IDs. If not provided, the default `getEdgeId` function is used.
   */
  getEdgeId?: GetEdgeId;
};

/**
 * A handy utility to update an existing [`Edge`](/api-reference/types/edge) with new properties.
 *This searches your edge array for an edge with a matching `id` and updates its
 *properties with the connection you provide.
 * @public
 * @param oldEdge - The edge you want to update.
 * @param newConnection - The new connection you want to update the edge with.
 * @param edges - The array of all current edges.
 * @returns The updated edges array.
 *
 * @example
 * ```js
 *const onReconnect = useCallback(
 *  (oldEdge: Edge, newConnection: Connection) => setEdges((els) => reconnectEdge(oldEdge, newConnection, els)),[]);
 *```
 */
export const reconnectEdge = <EdgeType extends EdgeBase>(
  oldEdge: EdgeType,
  newConnection: Connection,
  edges: EdgeType[],
  options: ReconnectEdgeOptions = { shouldReplaceId: true }
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

  const edgeIdGenerator = options.getEdgeId || getEdgeId;

  // Remove old edge and create the new edge with parameters of old edge.
  const edge = {
    ...rest,
    id: options.shouldReplaceId ? edgeIdGenerator(newConnection) : oldEdgeId,
    source: newConnection.source,
    target: newConnection.target,
    sourceHandle: newConnection.sourceHandle,
    targetHandle: newConnection.targetHandle,
  } as EdgeType;

  return edges.filter((e) => e.id !== oldEdgeId).concat(edge);
};

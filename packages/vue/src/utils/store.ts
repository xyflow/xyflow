import type {
  Connection,
  ConnectionLookup,
  CoordinateExtent,
  HandleType,
  IsValidConnection,
  NodeConnection,
  NodeLookup as SystemNodeLookup,
  ParentLookup as SystemParentLookup,
  ZIndexMode,
} from '@xyflow/system';
import type {
  Actions,
  DefaultEdgeOptions,
  Edge,
  InternalNode,
  Node,
  NodeOrigin,
  State,
  VueFlowInstance,
} from '../types';
import { adoptUserNodes, getEdgeId } from '@xyflow/system';
import { markRaw, toRaw, unref } from 'vue';
import { ErrorCode, VueFlowError } from './errors';
import { connectionExists, isEdge, isNode } from './graph';

type NonUndefined<T> = T extends undefined ? never : T;

export function isDef<T>(val: T): val is NonUndefined<T> {
  const unrefVal = unref(val);

  return typeof unrefVal !== 'undefined';
}

/**
 * Turn `target[key]` into a "controlled" field: every write, from props, `setState`, or a direct assignment,
 * runs `apply` (mirror to an external instance, e.g. the panZoom, or re-adopt nodes) after an optional
 * `transform`. A same-value re-assign is skipped so the side effect never fires redundantly. `target` must be
 * `reactive()`-wrapped for reads to stay reactive (the proxy tracks the key).
 */
export function defineControlled<T extends object, K extends keyof T>(
  target: T,
  key: K,
  apply: (value: T[K]) => void,
  transform: (value: T[K]) => T[K] = value => value,
) {
  // No backing ref needed: once `target` is `reactive()`-wrapped, reads/writes through the proxy are tracked
  // at the key level regardless of data-vs-accessor, so a plain closure is the storage. The dedupe guard
  // skips a redundant `apply` (Vue's own change check already dedupes the trigger).
  let value = transform(target[key]);

  Object.defineProperty(target, key, {
    get: () => value,
    set: (next: T[K]) => {
      const transformed = transform(next);

      if (Object.is(transformed, value)) {
        return;
      }

      value = transformed;
      apply(transformed);
    },
    enumerable: true,
    configurable: true,
  });
}

/**
 * Build a user `Edge` from a `Connection` (or validate a passed `Edge`). A `Connection` becomes a NEW
 * edge with `defaultEdgeOptions` merged in — the only point where defaults are persisted onto an edge.
 * User-supplied `Edge`s pass through verbatim; stored edges are never parsed or re-stamped.
 */
export function addEdgeToStore<EdgeType extends Edge = Edge>(
  edgeParams: EdgeType | Connection,
  edges: EdgeType[],
  triggerError: State['hooks']['error']['trigger'],
  defaultEdgeOptions?: DefaultEdgeOptions,
): EdgeType | false {
  if (!edgeParams || !edgeParams.source || !edgeParams.target) {
    triggerError(new VueFlowError(ErrorCode.EDGE_INVALID, (edgeParams as undefined | Edge)?.id ?? `[ID UNKNOWN]`));
    return false;
  }

  let edge: EdgeType;
  if (isEdge<EdgeType>(edgeParams)) {
    edge = edgeParams;
  }
  else {
    edge = {
      ...defaultEdgeOptions,
      ...edgeParams,
      id: getEdgeId(edgeParams),
    } as EdgeType;
  }

  if (connectionExists(edge, edges)) {
    return false;
  }

  return edge;
}

export function reconnectEdgeAction(
  edge: Edge,
  newConnection: Connection,
  prevEdge: Edge | undefined,
  shouldReplaceId: boolean,
  triggerError: State['hooks']['error']['trigger'],
) {
  if (!newConnection.source || !newConnection.target) {
    triggerError(new VueFlowError(ErrorCode.EDGE_INVALID, edge.id));
    return false;
  }

  if (!prevEdge) {
    triggerError(new VueFlowError(ErrorCode.EDGE_NOT_FOUND, edge.id));
    return false;
  }

  const { id, ...rest } = edge;

  return {
    ...rest,
    id: shouldReplaceId ? getEdgeId(newConnection) : id,
    source: newConnection.source,
    target: newConnection.target,
    sourceHandle: newConnection.sourceHandle,
    targetHandle: newConnection.targetHandle,
  };
}

export interface CreateInternalNodesOptions {
  nodeOrigin?: NodeOrigin;
  nodeExtent?: CoordinateExtent;
  elevateNodesOnSelect?: boolean;
  zIndexMode?: ZIndexMode;
  checkEquality?: boolean;
}

/**
 * Adopt user `Node`s into the store's lookups: validate them, then run `@xyflow/system`'s `adoptUserNodes`
 * against the persistent `nodeLookup`/`parentLookup` (mutated in place) to build the enriched
 * `InternalNode`s. `checkEquality` reuses the existing `InternalNode` when the user node is unchanged, so
 * re-adopting on every change is O(changed) and `measured`/`handleBounds` survive for unchanged nodes.
 *
 * Returns the validated user nodes (stored as `state.nodes`) plus `hasSelectedNodes` (used to clear a stale
 * `nodesSelectionActive`). InternalNodes live only in the lookup; `internals.userNode` points at the stored object.
 */
export function adoptNodes<NodeType extends Node = Node>(
  nodes: NodeType[],
  nodeLookup: SystemNodeLookup<InternalNode<NodeType>>,
  parentLookup: SystemParentLookup<InternalNode<NodeType>>,
  triggerError: State['hooks']['error']['trigger'],
  options?: CreateInternalNodesOptions,
): { nodes: NodeType[]; hasSelectedNodes: boolean } {
  const validNodes: NodeType[] = [];
  const seenNodeIds = new Set<string>();
  for (let i = 0; i < nodes.length; ++i) {
    const node = nodes[i];

    if (!isNode(node)) {
      triggerError(
        new VueFlowError(ErrorCode.NODE_INVALID, (node as undefined | Record<any, any>)?.id ?? `[ID UNKNOWN|INDEX ${i}]`),
      );
      continue;
    }

    // a duplicate id silently overwrites the earlier node in the id-keyed lookup (last wins)
    // surface it so the otherwise-invisible data bug is debuggable
    if (seenNodeIds.has(node.id)) {
      triggerError(new VueFlowError(ErrorCode.NODE_DUPLICATE_ID, node.id));
    }
    else {
      seenNodeIds.add(node.id);
    }

    // markRaw so Vue never deep-proxies the user node (large `data` stays raw).
    // toRaw first in case it arrived as a proxy.
    // UI reactivity comes from re-adopting (lookup `.set` + per-node render computed), not deep-proxying.
    validNodes.push(markRaw(toRaw(node)));
  }

  const priorMeasured = new Map<string, { width: number; height: number } | undefined>();
  for (const [id, internal] of nodeLookup) {
    const { width, height } = internal.measured ?? {};
    priorMeasured.set(id, width !== undefined && height !== undefined ? { width, height } : undefined);
  }

  const { hasSelectedNodes } = adoptUserNodes(validNodes, nodeLookup, parentLookup, { ...options, checkEquality: options?.checkEquality ?? true });

  for (const node of validNodes) {
    if (node.parentId && !nodeLookup.has(node.parentId)) {
      triggerError(new VueFlowError(ErrorCode.NODE_MISSING_PARENT, node.id, node.parentId));
    }

    const prior = priorMeasured.get(node.id);
    if (prior) {
      const internal = nodeLookup.get(node.id);
      if (internal && (internal.measured?.width === undefined || internal.measured?.height === undefined)) {
        internal.measured = prior;
      }
    }
  }

  return { nodes: validNodes, hasSelectedNodes };
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
  type: HandleType,
  connection: NodeConnection,
  connectionKey: string,
  connectionLookup: ConnectionLookup,
  nodeId: string,
  handleId: string | null,
) {
  let key = nodeId;
  const nodeMap = connectionLookup.get(key) || new Map();
  connectionLookup.set(key, nodeMap.set(connectionKey, connection));

  key = `${nodeId}-${type}`;
  const typeMap = connectionLookup.get(key) || new Map();
  connectionLookup.set(key, typeMap.set(connectionKey, connection));

  if (handleId) {
    key = `${nodeId}-${type}-${handleId}`;
    const handleMap = connectionLookup.get(key) || new Map();
    connectionLookup.set(key, handleMap.set(connectionKey, connection));
  }
}

export function updateConnectionLookup(connectionLookup: ConnectionLookup, edges: Edge[]) {
  connectionLookup.clear();

  for (const edge of edges) {
    const { source: sourceNode, target: targetNode, sourceHandle = null, targetHandle = null } = edge;

    const connection = { edgeId: edge.id, source: sourceNode, target: targetNode, sourceHandle, targetHandle };
    const sourceKey = `${sourceNode}-${sourceHandle}--${targetNode}-${targetHandle}`;
    const targetKey = `${targetNode}-${targetHandle}--${sourceNode}-${sourceHandle}`;

    addConnectionToLookup('source', connection, targetKey, connectionLookup, sourceNode, sourceHandle);
    addConnectionToLookup('target', connection, sourceKey, connectionLookup, targetNode, targetHandle);
  }
}

/**
 * Validate edges-or-connections for the store: the returned edges are the USER's objects (a `Connection`
 * becomes a new edge via {@link addEdgeToStore}, the only path that persists `defaultEdgeOptions`) — no
 * enrichment, no captured node references. Source/target resolution happens per-render in `EdgeWrapper`.
 *
 * @internal
 */
export function validateEdges<EdgeType extends Edge = Edge>(
  nextEdges: (EdgeType | Connection)[],
  isValidConnection: IsValidConnection | null,
  getInternalNode: Actions['getInternalNode'],
  onError: VueFlowInstance['emits']['error'],
  defaultEdgeOptions: DefaultEdgeOptions | undefined,
  edges: EdgeType[],
): EdgeType[] {
  const validEdges: EdgeType[] = [];

  for (const edgeOrConnection of nextEdges) {
    const edge = isEdge<EdgeType>(edgeOrConnection)
      ? edgeOrConnection
      : addEdgeToStore(edgeOrConnection, edges, onError, defaultEdgeOptions);

    if (!edge) {
      continue;
    }

    const sourceNode = getInternalNode(edge.source);
    const targetNode = getInternalNode(edge.target);

    if (!sourceNode || !targetNode) {
      validEdges.push(edge);
      continue;
    }

    if (isValidConnection && !isValidConnection(edge)) {
      onError(new VueFlowError(ErrorCode.EDGE_INVALID, edge.id));
      continue;
    }

    validEdges.push(edge);
  }

  return validEdges;
}

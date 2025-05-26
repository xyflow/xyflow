import type {
  Connection,
  CoordinateExtent,
  NodeConnection,
  NodeLookup as SystemNodeLookup,
  ParentLookup as SystemParentLookup,
  ZIndexMode,
} from '@xyflow/system';
import type {
  Actions,
  ConnectionLookup,
  DefaultEdgeOptions,
  Edge,
  InternalNode,
  Node,
  NodeOrigin,
  State,
  ValidConnectionFunc,
  VueFlowInstance,
} from '../types';
import { adoptUserNodes, getEdgeId } from '@xyflow/system';
import { markRaw, toRaw, unref } from 'vue';
import { connectionExists, ErrorCode, isEdge, isNode, VueFlowError } from '.';

type NonUndefined<T> = T extends undefined ? never : T;

export function isDef<T>(val: T): val is NonUndefined<T> {
  const unrefVal = unref(val);

  return typeof unrefVal !== 'undefined';
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
}

/**
 * Adopt user `Node`s into the store's lookups, xyflow/react+svelte style: validate, then run
 * `@xyflow/system`'s `adoptUserNodes` DIRECTLY against the PERSISTENT `nodeLookup`/`parentLookup`
 * (mutated in place — cleared + repopulated) to build the enriched `InternalNode`s with parent-aware
 * `internals.{positionAbsolute, z, rootParentIndex, handleBounds, userNode}`.
 *
 * There is no second `parseNode` pass and no vue-flow-specific default-stamping (parity with RF/SF, which
 * apply no node defaults — undefined fields stay undefined; consumers tolerate them). `checkEquality`
 * reuses the existing `InternalNode` by reference whenever the user node is unchanged, so re-adopting on
 * every change is O(changed) and `measured`/`handleBounds` survive for unchanged nodes for free.
 *
 * Returns the validated user nodes (to be stored as the canonical `state.nodes` array) plus
 * `hasSelectedNodes` (whether any adopted node is `selected`, surfaced by `adoptUserNodes` for free — the
 * caller uses it to clear a stale `nodesSelectionActive`). The InternalNodes live only in `nodeLookup`;
 * `internals.userNode` references the exact user object stored in the array.
 */
export function adoptNodes<NodeType extends Node = Node>(
  nodes: NodeType[],
  nodeLookup: SystemNodeLookup<InternalNode<NodeType>>,
  parentLookup: SystemParentLookup<InternalNode<NodeType>>,
  triggerError: State['hooks']['error']['trigger'],
  options?: CreateInternalNodesOptions,
): { nodes: NodeType[]; hasSelectedNodes: boolean } {
  const validNodes: NodeType[] = [];
  for (let i = 0; i < nodes.length; ++i) {
    const node = nodes[i];

    if (!isNode(node)) {
      triggerError(
        new VueFlowError(ErrorCode.NODE_INVALID, (node as undefined | Record<any, any>)?.id ?? `[ID UNKNOWN|INDEX ${i}]`),
      );
      continue;
    }

    // `markRaw` the user node so Vue never deep-proxies it (the perf goal — large `data` objects stay
    // raw). `toRaw` first in case it arrived as a reactive proxy; this is the choke point through which
    // every node enters `state.nodes`/`nodeLookup`. Reactivity for the UI comes from re-adopting (the
    // lookup `.set` + the per-node render computed), not from deep-proxying. Idempotent across re-adopts,
    // so `checkEquality` (reference identity) keeps matching for unchanged nodes.
    validNodes.push(markRaw(toRaw(node)));
  }

  const { hasSelectedNodes } = adoptUserNodes(validNodes, nodeLookup, parentLookup, { ...options, checkEquality: true });

  for (const node of validNodes) {
    if (node.parentId && !nodeLookup.has(node.parentId)) {
      triggerError(new VueFlowError(ErrorCode.NODE_MISSING_PARENT, node.id, node.parentId));
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
 * @param handleId handleId of the conneciton
 */
function addConnectionToLookup(
  type: 'source' | 'target',
  connection: NodeConnection,
  connectionKey: string,
  connectionLookup: ConnectionLookup,
  nodeId: string,
  handleId: string | null,
) {
  // We add the connection to the connectionLookup at the following keys
  // 1. nodeId, 2. nodeId-type, 3. nodeId-type-handleId
  // If the key already exists, we add the connection to the existing map
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
 * Validate edges-or-connections for the store, xyflow-style: the returned edges are the USER's objects
 * (a `Connection` becomes a new edge via {@link addEdgeToStore}, the only path that persists
 * `defaultEdgeOptions`) — no enrichment, no captured node references, no default-stamping. Source/target
 * node resolution and `EdgePosition` happen per-render in `EdgeWrapper`.
 *
 * @internal
 */
export function validateEdges<EdgeType extends Edge = Edge>(
  nextEdges: (EdgeType | Connection)[],
  isValidConnection: ValidConnectionFunc | null,
  getInternalNode: Actions['getInternalNode'],
  onError: VueFlowInstance['emits']['error'],
  defaultEdgeOptions: DefaultEdgeOptions | undefined,
  nodes: Node[],
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

    if (!sourceNode && !targetNode) {
      onError(new VueFlowError(ErrorCode.EDGE_SOURCE_TARGET_MISSING, edge.id, edge.source, edge.target));
      continue;
    }

    if (!sourceNode) {
      onError(new VueFlowError(ErrorCode.EDGE_SOURCE_MISSING, edge.id, edge.source));
      continue;
    }

    if (!targetNode) {
      onError(new VueFlowError(ErrorCode.EDGE_TARGET_MISSING, edge.id, edge.target));
      continue;
    }

    if (isValidConnection) {
      const isValid = isValidConnection(
        {
          source: edge.source,
          target: edge.target,
          sourceHandle: edge.sourceHandle ?? null,
          targetHandle: edge.targetHandle ?? null,
        },
        {
          edges,
          nodes,
          sourceNode,
          targetNode,
        },
      );

      if (!isValid) {
        onError(new VueFlowError(ErrorCode.EDGE_INVALID, edge.id));
        continue;
      }
    }

    validEdges.push(edge);
  }

  return validEdges;
}

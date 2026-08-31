import type { EdgeLookup, NodeLookup } from '@xyflow/system';
import type { Edge, InternalNode, Node, State } from '../types';
import { markRaw, toRaw } from 'vue';
import { adoptNodes, areNodesInitialized, ErrorCode, updateConnectionLookup, VueFlowError } from '../utils';
import { resolveFitView } from './fitView';

export interface Commit<NodeType extends Node = Node, EdgeType extends Edge = Edge> {
  /** system-side node lookup (source of truth for adoption); mirrored into the reactive `nodeLookup` */
  systemNodeLookup: NodeLookup<InternalNode<NodeType>>;
  /** system-side parent lookup; mirrored into the reactive `parentLookup` */
  systemParentLookup: Map<string, Map<string, InternalNode<NodeType>>>;
  /**
   * Single write path for nodes: re-adopt into the lookups (reusing unchanged `InternalNode`s by reference)
   * and store the user nodes as `state.nodes`. Callers must pass NEW objects for changed nodes, mutating in
   * place keeps the reference, so adoption reuses the stale `InternalNode`. Pass `checkEquality: false` to
   * force new refs (a reflow) even for unchanged nodes, e.g. after a `nodeExtent` change.
   */
  commitNodes: (nodes: NodeType[], checkEquality?: boolean) => void;
  /** Single write path for edges: stored verbatim, mirrored into `edgeLookup` + the connection lookup. */
  commitEdges: (next: EdgeType[]) => void;
  /**
   * Mirror the system lookups into the reactive ones. Exposed because the measurement path hands the
   * system-side lookups to `@xyflow/system`'s `updateNodeInternals`, which writes new node objects into
   * them; without a sync the reactive lookup keeps the pre-measurement entries.
   */
  syncLookups: () => void;
}

export function createCommit<NodeType extends Node = Node, EdgeType extends Edge = Edge>(
  state: State<NodeType, EdgeType>,
  nodeLookup: NodeLookup<InternalNode<NodeType>>,
  parentLookup: Map<string, Map<string, InternalNode<NodeType>>>,
  edgeLookup: EdgeLookup<EdgeType>,
): Commit<NodeType, EdgeType> {
  const systemNodeLookup: NodeLookup<InternalNode<NodeType>> = new Map();
  const systemParentLookup: Map<string, Map<string, InternalNode<NodeType>>> = new Map();

  function sameMapEntries<K, V>(a: Map<K, V>, b: Map<K, V>) {
    if (a.size !== b.size) {
      return false;
    }

    for (const [key, value] of a) {
      if (b.get(key) !== value) {
        return false;
      }
    }

    return true;
  }

  /** Mirror the system lookups into the reactive ones, touching only entries that actually changed. */
  function syncLookups() {
    const rawNodeLookup = toRaw(nodeLookup);

    for (const [id, internal] of systemNodeLookup) {
      if (rawNodeLookup.get(id) !== internal) {
        nodeLookup.set(id, markRaw(internal));
      }
    }

    if (rawNodeLookup.size !== systemNodeLookup.size) {
      for (const id of rawNodeLookup.keys()) {
        if (!systemNodeLookup.has(id)) {
          nodeLookup.delete(id);
        }
      }
    }

    const rawParentLookup = toRaw(parentLookup);

    for (const [parentId, children] of systemParentLookup) {
      const prev = rawParentLookup.get(parentId);
      if (!prev || !sameMapEntries(prev, children)) {
        parentLookup.set(parentId, children);
      }
    }

    if (rawParentLookup.size !== systemParentLookup.size) {
      for (const parentId of rawParentLookup.keys()) {
        if (!systemParentLookup.has(parentId)) {
          parentLookup.delete(parentId);
        }
      }
    }
  }

  function commitNodes(nodes: NodeType[], checkEquality = true) {
    const {
      nodes: adopted,
      hasSelectedNodes,
    } = adoptNodes(nodes, systemNodeLookup, systemParentLookup, state.hooks.error.trigger, {
      nodeOrigin: state.nodeOrigin,
      nodeExtent: state.nodeExtent,
      elevateNodesOnSelect: state.elevateNodesOnSelect,
      zIndexMode: state.zIndexMode,
      checkEquality,
    });

    state.nodes = adopted;

    state.nodesSelectionActive = state.nodesSelectionActive && hasSelectedNodes;

    // always mirror: `syncLookups` is the only writer that adds/prunes entries in the reactive
    // `nodeLookup`, so skipping it on parentless graphs leaves added nodes unrendered
    syncLookups();

    if (state.fitViewQueued && areNodesInitialized(nodeLookup)) {
      resolveFitView(state, nodeLookup);
    }
  }

  function commitEdges(next: EdgeType[]) {
    const rawEdgeLookup = toRaw(edgeLookup);
    const seenEdgeIds = new Set<string>();

    for (let i = 0; i < next.length; i++) {
      const edge = (next[i] = markRaw(toRaw(next[i])));
      if (seenEdgeIds.has(edge.id)) {
        state.hooks.error.trigger(new VueFlowError(ErrorCode.EDGE_DUPLICATE_ID, edge.id));
      }
      else {
        seenEdgeIds.add(edge.id);
      }
      if (rawEdgeLookup.get(edge.id) !== edge) {
        edgeLookup.set(edge.id, edge);
      }
    }

    if (rawEdgeLookup.size !== next.length) {
      const nextIds = new Set<string>();
      for (const edge of next) {
        nextIds.add(edge.id);
      }

      for (const id of rawEdgeLookup.keys()) {
        if (!nextIds.has(id)) {
          edgeLookup.delete(id);
        }
      }
    }

    state.edges = next;

    updateConnectionLookup(state.connectionLookup, next);
  }

  return { systemNodeLookup, systemParentLookup, commitNodes, commitEdges, syncLookups };
}

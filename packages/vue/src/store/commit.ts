import type { EdgeLookup, NodeLookup } from '@xyflow/system';
import type { Edge, InternalNode, Node, State } from '../types';
import { updateConnectionLookup } from '@xyflow/system';
import { markRaw, toRaw } from 'vue';
import { adoptNodes, areNodesInitialized, ErrorCode, VueFlowError } from '../utils';
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
  syncLookups: (updatedNodes?: Set<string>) => void;
}

export function createCommit<NodeType extends Node = Node, EdgeType extends Edge = Edge>(
  state: State<NodeType, EdgeType>,
  nodeLookup: NodeLookup<InternalNode<NodeType>>,
  parentLookup: Map<string, Map<string, InternalNode<NodeType>>>,
  edgeLookup: EdgeLookup<EdgeType>,
): Commit<NodeType, EdgeType> {
  const systemNodeLookup: NodeLookup<InternalNode<NodeType>> = new Map();
  const systemParentLookup: Map<string, Map<string, InternalNode<NodeType>>> = new Map();
  // the system owns the raw edge lookup so `updateConnectionLookup` can diff against it; the reactive
  // `edgeLookup` is mirrored from the ids it reports back
  const systemEdgeLookup: EdgeLookup<EdgeType> = new Map();

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
  function syncLookups(updatedNodes?: Set<string>) {
    const rawNodeLookup = toRaw(nodeLookup);

    if (updatedNodes) {
      // the system tells us exactly which ids changed, including ones it dropped
      for (const id of updatedNodes) {
        const internal = systemNodeLookup.get(id);
        if (!internal) {
          nodeLookup.delete(id);
        }
        else if (rawNodeLookup.get(id) !== internal) {
          nodeLookup.set(id, markRaw(internal));
        }
      }
    }
    else {
      for (const [id, internal] of systemNodeLookup) {
        if (rawNodeLookup.get(id) !== internal) {
          nodeLookup.set(id, markRaw(internal));
        }
      }

      // no change set to work from: a same-size add+remove would otherwise leave a stale entry
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
      updatedNodes,
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
    syncLookups(updatedNodes);

    if (state.fitViewQueued && areNodesInitialized(nodeLookup)) {
      resolveFitView(state, nodeLookup);
    }
  }

  function commitEdges(next: EdgeType[]) {
    const seenEdgeIds = new Set<string>();

    for (let i = 0; i < next.length; i++) {
      const edge = (next[i] = markRaw(toRaw(next[i])));
      if (seenEdgeIds.has(edge.id)) {
        state.hooks.error.trigger(new VueFlowError(ErrorCode.EDGE_DUPLICATE_ID, edge.id));
      }
      else {
        seenEdgeIds.add(edge.id);
      }
    }

    state.edges = next;

    const { updatedEdges } = updateConnectionLookup(state.connectionLookup, systemEdgeLookup, next);

    // mirror only what changed, instead of scanning every edge
    for (const id of updatedEdges) {
      const edge = systemEdgeLookup.get(id);
      if (edge) {
        edgeLookup.set(id, edge);
      }
      else {
        edgeLookup.delete(id);
      }
    }
  }

  return { systemNodeLookup, systemParentLookup, commitNodes, commitEdges, syncLookups };
}

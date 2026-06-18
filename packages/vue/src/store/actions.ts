import type {
  EdgeRemoveChange,
  EdgeSelectionChange,
  NodeDimensionChange,
  NodePositionChange,
  NodeRemoveChange,
  Rect,
} from '@xyflow/system';
import type {
  Actions,
  Edge,
  EdgeAddChange,
  EdgeLookup,
  InternalNode,
  Node,
  NodeAddChange,
  NodeLookup,
  State,
} from '../types';
import {
  clampPosition,
  clampPositionToParent,
  getConnectedEdges as getConnectedEdgesBase,
  getDimensions,
  getElementsToRemove,
  getHandleBounds,
  getOverlappingArea,
  handleExpandParent,
  isRectObject,
  nodeToRect,
  panBy as panBySystem,
  updateAbsolutePositions,
} from '@xyflow/system';
import { computed, markRaw, toRaw } from 'vue';
import { useViewportHelper } from '../composables';
import {
  adoptNodes,
  applyChanges,
  createAdditionChange,
  createEdgeRemoveChange,
  createNodeRemoveChange,
  createSelectionChange,
  getSelectionChanges,
  isDef,
  isInternalNode,
  isNode,
  reconnectEdgeAction,
  updateConnectionLookup,
  validateEdges,
} from '../utils';
import { storeOptionsToSkip, useState } from './state';

export function useActions<NodeType extends Node = Node, EdgeType extends Edge = Edge>(
  state: State<NodeType, EdgeType>,
  nodeLookup: NodeLookup<NodeType>,
  parentLookup: Map<string, Map<string, InternalNode<NodeType>>>,
  edgeLookup: EdgeLookup<EdgeType>,
): Actions<NodeType, EdgeType> {
  const viewportHelper = useViewportHelper(state, nodeLookup);

  // The system-facing twins of the reactive lookups. `@xyflow/system`'s `adoptUserNodes` re-adopts by
  // clearing + refilling the lookup it's given — on a `reactive(Map)` that's an O(n) trigger storm per
  // call (`clear()` invalidates every key and iteration subscriber, every drag frame). Adoption and
  // recompute therefore run against these plain Maps (which also persist across adoptions, keeping
  // `checkEquality` reuse intact); `syncLookups` then mirrors the result into the reactive lookups with
  // targeted `.set`/`.delete`, so only entries whose `InternalNode` reference actually changed trigger —
  // per-frame render invalidation stays O(changed) instead of O(n).
  const systemNodeLookup: NodeLookup<NodeType> = new Map();
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
        // `markRaw` exactly the entries that are new since the last sync — `adoptUserNodes` rebuilds
        // changed nodes as fresh plain objects and `updateAbsolutePositions` clones moved children, and
        // without the mark the reactive lookup would deep-proxy them on read. The per-node render
        // computed still re-renders on the `.set` (key-level reactivity is independent of value markRaw).
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

    // adoption rebuilds every nested child-map instance, so compare content — blindly re-setting an
    // unchanged entry would re-trigger every `parentLookup` subscriber each frame
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

  /**
   * Single write path for node membership/content. Takes the canonical USER `Node`s, re-adopts them into
   * `nodeLookup`/`parentLookup` via `adoptNodes` (xyflow/react+svelte parity — `adoptUserNodes` mutates the
   * lookups in place, reusing unchanged `InternalNode`s by reference via `checkEquality`), then stores the
   * validated user nodes as `state.nodes` (the v-model array / `getNodes`). The enriched `InternalNode`s
   * live only in the lookup. `recomputeAbsolutePositions` refreshes parent-aware absolute positions/z.
   *
   * Because adoption is immutable+reference-based, callers MUST pass NEW user-node objects for changed
   * nodes (see the immutable `applyChanges`) — mutating a node in place keeps its reference, so
   * `checkEquality` would re-adopt the stale `InternalNode`.
   */
  function commitNodes(nodes: NodeType[]) {
    const { nodes: adopted, hasSelectedNodes } = adoptNodes(nodes, systemNodeLookup, systemParentLookup, state.hooks.error.trigger, {
      nodeOrigin: state.nodeOrigin,
      nodeExtent: state.nodeExtent,
      elevateNodesOnSelect: state.elevateNodesOnSelect,
      zIndexMode: state.zIndexMode,
    });

    state.nodes = adopted;

    // clear a stale visual selection box: `nodesSelectionActive` only ever turns on via a user drag-select,
    // so once the selection empties out (e.g. the selected nodes were deleted) it must turn back off — else
    // a later programmatic select would wrongly render the `NodesSelection` rect (xyflow/react #5727).
    state.nodesSelectionActive = state.nodesSelectionActive && hasSelectedNodes;

    recomputeAbsolutePositions();
  }

  /**
   * Single write path for edge membership (see {@link commitNodes}). Stores the USER edges verbatim
   * (`edgeLookup` values are the same references as the `state.edges` elements; no
   * enriched edge representation exists). `markRaw` at this choke point keeps edges out of Vue's deep
   * proxy: renders are driven by key-level lookup triggers + immutable replacement, like nodes.
   */
  function commitEdges(next: EdgeType[]) {
    // targeted sync instead of clear+refill: clearing a `reactive(Map)` invalidates every edge
    // subscriber even when a single edge changed
    const rawEdgeLookup = toRaw(edgeLookup);

    for (let i = 0; i < next.length; i++) {
      const edge = (next[i] = markRaw(toRaw(next[i])));
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

    // the connection lookup derives 1:1 from the edges array — rebuilding it here keeps every write
    // path (setEdges/applyEdgeChanges/reconnectEdge/$reset) consistent by construction
    updateConnectionLookup(state.connectionLookup, state.edges);
  }

  /**
   * Recompute parent-aware `internals.positionAbsolute` on the system lookup, then mirror into the
   * reactive lookups (`syncLookups`). Lookup-only: there is NO write-back onto `state.nodes` — those hold
   * the raw user `Node`s. This replaces the per-node positionAbsolute watcher that used to live in
   * `NodeWrapper`.
   *
   * Adoption (`adoptUserNodes`) already computes clamped positions and `z` (via `calculateZ`, including
   * select-elevation) for every changed node, so the full `updateAbsolutePositions` pass only runs for
   * graphs with child nodes — or when `forceFullPass` says inputs changed without a re-adoption.
   */
  function recomputeAbsolutePositions(forceFullPass = false) {
    // `adoptUserNodes` already computed the clamped `positionAbsolute` + `z` for every changed node
    // (reused nodes keep their still-valid values) and cascades parented nodes inline, so after a commit
    // the full pass is only needed when child nodes exist — a moved parent must cascade to REUSED
    // children regardless of the user array's parent/child order. Callers that change inputs without
    // re-adopting (`setNodeExtent`) force it.
    if (forceFullPass || systemParentLookup.size > 0) {
      updateAbsolutePositions(systemNodeLookup, systemParentLookup, {
        nodeOrigin: state.nodeOrigin,
        nodeExtent: state.nodeExtent,
        elevateNodesOnSelect: state.elevateNodesOnSelect,
        zIndexMode: state.zIndexMode,
      });
    }

    syncLookups();
  }

  const updateNodeInternals: Actions<NodeType>['updateNodeInternals'] = (ids) => {
    const updateIds = ids ?? [];

    state.hooks.updateNodeInternals.trigger(updateIds);
  };

  const getConnectedEdges: Actions<NodeType, EdgeType>['getConnectedEdges'] = (nodes) => {
    return getConnectedEdgesBase(nodes, state.edges);
  };

  const getHandleConnections: Actions['getHandleConnections'] = ({ id, type, nodeId }) => {
    const handleSuffix = id ? `-${type}-${id}` : `-${type}`;
    return Array.from(state.connectionLookup.get(`${nodeId}${handleSuffix}`)?.values() ?? []);
  };

  const getNode: Actions<NodeType>['getNode'] = (id) => {
    if (!id) {
      return;
    }

    // The public contract: `getNode` returns the user-facing `Node` (the exact object held in
    // `state.nodes`/v-model), which the store keeps on the InternalNode as `internals.userNode`. Enriched
    // data (internals/measured) is reached via `getInternalNode`. Don't mutate the result in place — it
    // won't propagate; use the helpers (updateNode/applyNodeChanges/setNodes).
    return nodeLookup.get(id)?.internals.userNode as NodeType | undefined;
  };

  // The enriched-node accessor (xyflow/react parity): returns the lookup `InternalNode` (enriched
  // `internals`/`measured`), whereas `getNode` returns the user-facing `Node` (`internals.userNode`).
  // Internal call sites that need `internals`/`measured` use this.
  const getInternalNode: Actions<NodeType>['getInternalNode'] = (id) => {
    if (!id) {
      return;
    }

    return nodeLookup.get(id);
  };

  const getEdge: Actions<NodeType, EdgeType>['getEdge'] = (id) => {
    if (!id) {
      return;
    }

    return edgeLookup.get(id);
  };

  const updateNodePositions: Actions<NodeType>['updateNodePositions'] = (dragItems, changed, dragging) => {
    const changes: (NodePositionChange | NodeDimensionChange)[] = [];
    const parentExpandChildren: { id: string; parentId: string; rect: Rect }[] = [];

    for (const node of dragItems) {
      // read `expandParent`/`parentId` from the canonical node: drag items carry them, but keyboard-move
      // items (from `useUpdateNodePositions`) do not.
      const lookupNode = getNode(node.id);
      const expandParentId = lookupNode?.expandParent ? lookupNode.parentId : undefined;

      const change: NodePositionChange = {
        id: node.id,
        type: 'position',
        dragging,
        positionAbsolute: node.internals.positionAbsolute,
      };

      if (changed) {
        // drag items already carry the parent-RELATIVE position: XYDrag's `calculateNodePosition` and the
        // keyboard path's `calcNextPosition` both subtract the parent offset before handing items here.
        change.position = node.position;

        if (expandParentId) {
          // pin the child's relative position to >= 0; the parent grows to contain it instead
          // (xyflow/react clamps the same way before collecting the child for expansion).
          change.position = { x: Math.max(0, change.position.x), y: Math.max(0, change.position.y) };

          parentExpandChildren.push({
            id: node.id,
            parentId: expandParentId,
            rect: {
              ...node.internals.positionAbsolute,
              width: node.measured?.width ?? 0,
              height: node.measured?.height ?? 0,
            },
          });
        }
      }

      changes.push(change);
    }

    // grow each parent to fit its `expandParent` children — system returns the parent's position +
    // dimension changes plus counter-offsets for the other children, applied through the same pipeline.
    if (parentExpandChildren.length > 0) {
      changes.push(...handleExpandParent(parentExpandChildren, systemNodeLookup, systemParentLookup, state.nodeOrigin));
    }

    if (changes.length) {
      state.hooks.nodesChange.trigger(changes);
    }
  };

  const updateNodeDimensions: Actions<NodeType>['updateNodeDimensions'] = (updates) => {
    if (!state.vueFlowRef) {
      return;
    }

    const viewportNode = state.vueFlowRef.querySelector('.vue-flow__viewport') as HTMLElement;

    if (!viewportNode) {
      return;
    }

    const style = window.getComputedStyle(viewportNode);
    const { m22: zoom } = new window.DOMMatrixReadOnly(style.transform);

    const changes: (NodeDimensionChange | NodePositionChange)[] = [];
    const parentExpandChildren: { id: string; parentId: string; rect: Rect }[] = [];

    for (const element of updates) {
      const update = element;

      const node = getInternalNode(update.id);

      if (node) {
        const dimensions = getDimensions(update.nodeElement);

        const doUpdate = !!(
          dimensions.width
          && dimensions.height
          && (node.measured.width !== dimensions.width || node.measured.height !== dimensions.height || update.forceUpdate)
        );

        if (doUpdate) {
          const nodeBounds = update.nodeElement.getBoundingClientRect();
          node.measured = { width: dimensions.width, height: dimensions.height };
          if (!node.internals.handleBounds) {
            node.internals.handleBounds = { source: null, target: null };
          }
          node.internals.handleBounds.source = getHandleBounds('source', update.nodeElement, nodeBounds, zoom, node.id);
          node.internals.handleBounds.target = getHandleBounds('target', update.nodeElement, nodeBounds, zoom, node.id);

          changes.push({
            id: node.id,
            type: 'dimensions',
            dimensions,
          });

          // a freshly-measured `expandParent` child grows its parent to fit (mirrors system's own
          // `updateNodeDimensions`). Unlike the drag path (where the position is the user's target), here
          // the position is fixed and only the size grew — so re-clamp it against the NEW dimensions and
          // the node's extent BEFORE measuring expansion, exactly as system does. Otherwise a node that
          // merely grew would be treated as overflowing and the parent would expand more than necessary.
          if (node.expandParent && node.parentId) {
            const parent = getInternalNode(node.parentId);
            let positionAbsolute = node.internals.positionAbsolute;
            const extent = node.extent;

            if (extent === 'parent' && parent) {
              positionAbsolute = clampPositionToParent(positionAbsolute, dimensions, parent);
            }
            else if (Array.isArray(extent)) {
              positionAbsolute = clampPosition(positionAbsolute, extent, dimensions);
            }
            else {
              positionAbsolute = clampPosition(positionAbsolute, state.nodeExtent, dimensions);
            }

            parentExpandChildren.push({
              id: node.id,
              parentId: node.parentId,
              rect: { ...positionAbsolute, width: dimensions.width, height: dimensions.height },
            });
          }

          // Re-set a fresh entry so the markRaw lookup re-renders this node — in-place `measured`/
          // `handleBounds` writes don't trigger the per-node render computed (markRaw values aren't deep
          // tracked; only the lookup `.set` is). This makes measurement reflect even with `autoApplyChanges:false`
          // (the 'dimensions' change additionally flows `measured` onto the user node via re-adopt).
          // The fresh entry goes into BOTH maps: the system map is what `adoptUserNodes` reuses via
          // `checkEquality`, so leaving the old object there would let the maps' references diverge.
          const fresh = markRaw({ ...toRaw(node) });
          systemNodeLookup.set(node.id, fresh);
          nodeLookup.set(node.id, fresh);
        }
      }
    }

    if (parentExpandChildren.length > 0) {
      changes.push(...handleExpandParent(parentExpandChildren, systemNodeLookup, systemParentLookup, state.nodeOrigin));
    }

    // the initial `fitView` (the `fitView` prop) is handled reactively by `useFitViewOnInit`: it waits
    // for every node to be measured AND re-fits while the container is still settling — neither of which
    // a one-shot here (fired per measurement batch, against a partial/zero-bounds subset) could do.

    if (changes.length) {
      state.hooks.nodesChange.trigger(changes);
    }
  };

  const addSelectedNodes: Actions<NodeType>['addSelectedNodes'] = (nodes) => {
    if (state.multiSelectionActive) {
      const nodeChanges = nodes.map(node => createSelectionChange(node.id, true));
      state.hooks.nodesChange.trigger(nodeChanges);
      return;
    }

    state.hooks.nodesChange.trigger(getSelectionChanges(nodeLookup, new Set(nodes.map(n => n.id))));
    state.hooks.edgesChange.trigger(getSelectionChanges(edgeLookup));
  };

  const addSelectedEdges: Actions<NodeType, EdgeType>['addSelectedEdges'] = (edges) => {
    if (state.multiSelectionActive) {
      const changedEdges = edges.map(edge => createSelectionChange(edge.id, true));
      state.hooks.edgesChange.trigger(changedEdges as EdgeSelectionChange[]);
      return;
    }

    state.hooks.edgesChange.trigger(getSelectionChanges(edgeLookup, new Set(edges.map(e => e.id))));
    state.hooks.nodesChange.trigger(getSelectionChanges(nodeLookup, new Set()));
  };

  const removeSelectedNodes: Actions<NodeType>['removeSelectedNodes'] = (nodes) => {
    const nodesToUnselect = nodes || state.nodes;

    // Emit select=false changes only for nodes that ARE selected — skipping the rest avoids re-committing
    // (and re-rendering) every node on an unselect, e.g. on drag start with `selectNodesOnDrag: false`
    // (xyflow/react #5682). `applyNodeChanges` applies them immutably + re-adopts (no in-place
    // `n.selected = false`: it would keep the node's reference, so the re-adopt would reuse the stale entry).
    const nodeChanges = nodesToUnselect.filter(n => n.selected).map(n => createSelectionChange(n.id, false));

    if (nodeChanges.length) {
      state.hooks.nodesChange.trigger(nodeChanges);
    }
  };

  const removeSelectedEdges: Actions<NodeType, EdgeType>['removeSelectedEdges'] = (edges) => {
    const edgesToUnselect = edges || state.edges;

    const edgeChanges = edgesToUnselect.filter(e => e.selected).map(e => createSelectionChange(e.id, false));

    if (edgeChanges.length) {
      state.hooks.edgesChange.trigger(edgeChanges);
    }
  };

  const resetSelectedElements: Actions<NodeType, EdgeType>['resetSelectedElements'] = () => {
    // the interactive selection reset (used by a pane click): a no-op while selection is disabled, so a
    // selection made before `elementsSelectable` was turned off — or set programmatically — survives the
    // click (xyflow/react #5217). For unconditional clearing, call `removeSelectedNodes`/`removeSelectedEdges`
    // directly (the equivalent of xyflow/react's ungated `unselectNodesAndEdges`).
    if (!state.elementsSelectable) {
      return;
    }

    removeSelectedNodes();
    removeSelectedEdges();
  };

  const setMinZoom: Actions<NodeType>['setMinZoom'] = (minZoom) => {
    state.panZoom?.setScaleExtent([minZoom, state.maxZoom]);
    state.minZoom = minZoom;
  };

  const setMaxZoom: Actions<NodeType>['setMaxZoom'] = (maxZoom) => {
    state.panZoom?.setScaleExtent([state.minZoom, maxZoom]);
    state.maxZoom = maxZoom;
  };

  const setTranslateExtent: Actions<NodeType>['setTranslateExtent'] = (translateExtent) => {
    state.panZoom?.setTranslateExtent(translateExtent);
    state.translateExtent = translateExtent;
  };

  const setNodeExtent: Actions<NodeType>['setNodeExtent'] = (nodeExtent) => {
    state.nodeExtent = nodeExtent;
    // force the full system pass — the extent changed without a re-adoption, so every root needs re-clamping
    recomputeAbsolutePositions(true);
    updateNodeInternals();
  };

  const setPaneClickDistance: Actions<NodeType>['setPaneClickDistance'] = (clickDistance) => {
    state.panZoom?.setClickDistance(clickDistance);
  };

  const setInteractive: Actions<NodeType>['setInteractive'] = (isInteractive) => {
    state.nodesDraggable = isInteractive;
    state.nodesConnectable = isInteractive;
    state.elementsSelectable = isInteractive;
  };

  const setNodes: Actions<NodeType>['setNodes'] = (nodes) => {
    const nextNodes = typeof nodes === 'function' ? nodes(state.nodes) : nodes;

    if (!state.initialized && !nextNodes.length) {
      return;
    }

    // `commitNodes` re-adopts the user nodes into the lookup (xyflow-style) and stores them as `state.nodes`
    commitNodes(nextNodes);
  };

  const setEdges: Actions<NodeType, EdgeType>['setEdges'] = (edges) => {
    const nextEdges = typeof edges === 'function' ? edges(state.edges) : edges;

    if (!state.initialized && !nextEdges.length) {
      return;
    }

    commitEdges(
      validateEdges<EdgeType>(
        nextEdges,
        state.isValidConnection,
        getInternalNode,
        state.hooks.error.trigger,
        state.defaultEdgeOptions,
        state.nodes,
        state.edges,
      ),
    );
  };

  const addNodes: Actions<NodeType>['addNodes'] = (nodes) => {
    let nextNodes = typeof nodes === 'function' ? nodes(state.nodes) : nodes;
    nextNodes = Array.isArray(nextNodes) ? nextNodes : [nextNodes];

    // Emit `add` changes for the valid user nodes (filter invalid up front — `applyChanges` would
    // otherwise read `.id` off a non-node and throw; `commitNodes`/`adoptNodes` re-validates on adopt).
    const changes: NodeAddChange<NodeType>[] = [];
    for (const node of nextNodes) {
      if (!isNode(node)) {
        continue;
      }
      changes.push(createAdditionChange(node));
    }

    if (changes.length) {
      state.hooks.nodesChange.trigger(changes);
    }
  };

  const addEdges: Actions<NodeType, EdgeType>['addEdges'] = (params) => {
    let nextEdges = typeof params === 'function' ? params(state.edges) : params;
    nextEdges = Array.isArray(nextEdges) ? nextEdges : [nextEdges];

    // the `add` change items are the validated USER edges (a `Connection` becomes a new edge with
    // `defaultEdgeOptions` merged at creation) — no enrichment leaks into the change event payload
    const validEdges = validateEdges<EdgeType>(
      nextEdges,
      state.isValidConnection,
      getInternalNode,
      state.hooks.error.trigger,
      state.defaultEdgeOptions,
      state.nodes,
      state.edges,
    );

    const changes: EdgeAddChange<EdgeType>[] = [];
    for (const edge of validEdges) {
      changes.push(createAdditionChange(edge));
    }

    if (changes.length) {
      state.hooks.edgesChange.trigger(changes);
    }
  };

  const removeNodes: Actions<NodeType>['removeNodes'] = (nodes, removeConnectedEdges = true, removeChildren = false) => {
    const nextNodes = typeof nodes === 'function' ? nodes(state.nodes) : nodes;
    const nodesToRemove = Array.isArray(nextNodes) ? nextNodes : [nextNodes];

    const nodeChanges: NodeRemoveChange[] = [];
    const edgeChanges: EdgeRemoveChange[] = [];

    function createEdgeRemovalChanges(nodes: Node[]) {
      const connectedEdges = getConnectedEdges(nodes);
      for (const edge of connectedEdges) {
        // deletable is no longer stamped onto stored edges — resolve through defaultEdgeOptions at read time
        const deletable = edge.deletable ?? state.defaultEdgeOptions?.deletable;
        if (isDef(deletable) ? deletable : true) {
          edgeChanges.push(createEdgeRemoveChange(edge.id));
        }
      }
    }

    // recursively get all children and if the child is a parent, get those children as well until all nodes have been removed that are children of the current node
    function createChildrenRemovalChanges(id: string) {
      const children: NodeType[] = [];
      for (const node of state.nodes) {
        if (node.parentId === id) {
          children.push(node);
        }
      }

      if (children.length) {
        for (const child of children) {
          nodeChanges.push(createNodeRemoveChange(child.id));
        }

        if (removeConnectedEdges) {
          createEdgeRemovalChanges(children);
        }

        for (const child of children) {
          createChildrenRemovalChanges(child.id);
        }
      }
    }

    for (const item of nodesToRemove) {
      const currNode = typeof item === 'string' ? getNode(item) : item;

      if (!currNode) {
        continue;
      }

      if (isDef(currNode.deletable) && !currNode.deletable) {
        continue;
      }

      nodeChanges.push(createNodeRemoveChange(currNode.id));

      if (removeConnectedEdges) {
        createEdgeRemovalChanges([currNode as Node]);
      }

      if (removeChildren) {
        createChildrenRemovalChanges(currNode.id);
      }
    }

    if (edgeChanges.length) {
      state.hooks.edgesChange.trigger(edgeChanges);
    }

    if (nodeChanges.length) {
      state.hooks.nodesChange.trigger(nodeChanges);
    }
  };

  const removeEdges: Actions<NodeType, EdgeType>['removeEdges'] = (edges) => {
    const nextEdges = typeof edges === 'function' ? edges(state.edges) : edges;
    const edgesToRemove = Array.isArray(nextEdges) ? nextEdges : [nextEdges];

    const changes: EdgeRemoveChange[] = [];

    for (const item of edgesToRemove) {
      const currEdge = typeof item === 'string' ? getEdge(item) : item;

      if (!currEdge) {
        continue;
      }

      const deletable = currEdge.deletable ?? state.defaultEdgeOptions?.deletable;
      if (isDef(deletable) && !deletable) {
        continue;
      }

      changes.push(createEdgeRemoveChange(typeof item === 'string' ? item : item.id));
    }

    state.hooks.edgesChange.trigger(changes);
  };

  const deleteElements: Actions<NodeType, EdgeType>['deleteElements'] = async ({ nodes = [], edges = [] }) => {
    // `getElementsToRemove` (xyflow/system) gathers the full set — the targeted nodes + their child nodes,
    // plus connected + explicitly-listed edges, skipping `deletable: false` — then consults `onBeforeDelete`
    // and returns the elements that should actually be removed (`false` → none, an object → that subset).
    const { nodes: matchingNodes, edges: matchingEdges } = await getElementsToRemove<NodeType, EdgeType>({
      nodesToRemove: nodes,
      edgesToRemove: edges,
      nodes: state.nodes,
      edges: state.edges,
      onBeforeDelete: state.onBeforeDelete ?? undefined,
    });

    // remove exactly that set: `matchingNodes` already includes children and `matchingEdges` the connected
    // edges (both reflecting any `onBeforeDelete` filtering), so tell `removeNodes` NOT to also pull in
    // connected edges/children — that would bypass an `onBeforeDelete` that chose to keep some.
    if (matchingNodes.length) {
      removeNodes(matchingNodes, false, false);
    }

    if (matchingEdges.length) {
      removeEdges(matchingEdges);
    }

    return { deletedNodes: matchingNodes, deletedEdges: matchingEdges };
  };

  const reconnectEdge: Actions<NodeType, EdgeType>['reconnectEdge'] = (oldEdge, newConnection, shouldReplaceId = true) => {
    const prevEdge = getEdge(oldEdge.id);

    if (!prevEdge) {
      return false;
    }

    // resolve by id, not identity — callers commonly pass stale references (e.g. an edge captured in an
    // event payload before an immutable change replaced the stored object)
    const prevEdgeIndex = state.edges.findIndex(edge => edge.id === oldEdge.id);

    const newEdge = reconnectEdgeAction(oldEdge, newConnection, prevEdge as EdgeType, shouldReplaceId, state.hooks.error.trigger);

    if (newEdge) {
      const [validEdge] = validateEdges<EdgeType>(
        [newEdge as unknown as EdgeType],
        state.isValidConnection,
        getInternalNode,
        state.hooks.error.trigger,
        state.defaultEdgeOptions,
        state.nodes,
        state.edges,
      );

      if (!validEdge) {
        return false;
      }

      commitEdges(state.edges.map((edge, index) => (index === prevEdgeIndex ? validEdge : edge)));

      return validEdge;
    }

    return false;
  };

  const updateEdge: Actions<NodeType, EdgeType>['updateEdge'] = (id, edgeUpdate, options = { replace: false }) => {
    const edge = getEdge(id);

    if (!edge) {
      return;
    }

    const nextEdge = typeof edgeUpdate === 'function' ? edgeUpdate(edge as EdgeType) : edgeUpdate;

    // immutable: build a NEW edge (full replace or shallow merge) for the target id and recommit
    const next = state.edges.map(e => (e.id === id ? ((options.replace ? nextEdge : { ...e, ...nextEdge }) as EdgeType) : e));
    commitEdges(next);
  };

  const updateEdgeData: Actions<NodeType, EdgeType>['updateEdgeData'] = (id, dataUpdate, options = { replace: false }) => {
    const edge = getEdge(id);

    if (!edge) {
      return;
    }

    const nextData = typeof dataUpdate === 'function' ? dataUpdate(edge as EdgeType) : dataUpdate;

    // build a NEW edge object — in-place mutation isn't reactive (edges are markRaw'd; renders trigger
    // on lookup replacement)
    const nextEdge = { ...edge, data: options.replace ? nextData : { ...edge.data, ...nextData } } as EdgeType;

    commitEdges(state.edges.map(item => (item.id === id ? nextEdge : item)));
  };

  const applyNodeChanges: Actions<NodeType>['applyNodeChanges'] = (changes) => {
    // Apply changes IMMUTABLY against the canonical user nodes (`applyChanges` returns a new array — new
    // objects for changed nodes, unchanged reused by reference), then re-adopt via `commitNodes`
    // (`adoptUserNodes` reuses unchanged InternalNodes by reference via `checkEquality`).
    const result = applyChanges(changes, state.nodes);
    commitNodes(result);
    return result;
  };

  const applyEdgeChanges: Actions<NodeType, EdgeType>['applyEdgeChanges'] = (changes) => {
    // apply immutably against the canonical user edges: new array, new objects for changed edges,
    // unchanged reused by reference
    const result = applyChanges(changes, state.edges);
    commitEdges(result);
    return result;
  };

  const updateNode: Actions<NodeType>['updateNode'] = (id, nodeUpdate, options = { replace: false }) => {
    const node = getInternalNode(id);

    if (!node) {
      return;
    }

    const nextNode = typeof nodeUpdate === 'function' ? nodeUpdate(node) : nodeUpdate;

    // Immutable update: build a NEW user node (full replacement or shallow merge) for the target id and
    // re-adopt via `commitNodes`. Mutating in place would keep the reference and re-adopt the stale node.
    const next = state.nodes.map(n => (n.id === id ? ((options.replace ? nextNode : { ...n, ...nextNode }) as NodeType) : n));
    commitNodes(next);
  };

  const updateNodeData: Actions<NodeType>['updateNodeData'] = (id, dataUpdate, options = { replace: false }) => {
    const node = getInternalNode(id);

    if (!node) {
      return;
    }

    const nextData = typeof dataUpdate === 'function' ? dataUpdate(node) : dataUpdate;

    // Immutable: new user node with new `data`, then re-adopt (see {@link updateNode}).
    const next = state.nodes.map(n =>
      n.id === id ? ({ ...n, data: options.replace ? nextData : { ...n.data, ...nextData } } as NodeType) : n,
    );
    commitNodes(next);
  };

  const startConnection: Actions<NodeType>['startConnection'] = (startHandle, position, isClick = false) => {
    if (isClick) {
      state.connectionClickStartHandle = startHandle;
    }
    else {
      state.connectionStartHandle = startHandle;
    }

    state.connectionEndHandle = null;
    state.connectionStatus = null;

    if (position) {
      state.connectionPosition = position;
    }
  };

  const updateConnection: Actions<NodeType>['updateConnection'] = (position, result = null, status = null) => {
    if (state.connectionStartHandle) {
      state.connectionPosition = position;
      state.connectionEndHandle = result;
      state.connectionStatus = status;
    }
  };

  const endConnection: Actions<NodeType>['endConnection'] = (event, isClick) => {
    state.connectionPosition = { x: Number.NaN, y: Number.NaN };
    state.connectionEndHandle = null;
    state.connectionStatus = null;

    if (isClick) {
      state.connectionClickStartHandle = null;
    }
    else {
      state.connectionStartHandle = null;
    }
  };

  const getNodeRect = (
    nodeOrRect: (Partial<Node> & { id: Node['id'] }) | Rect,
  ): [Rect | null, Node | null | undefined, boolean] => {
    const isRectObj = isRectObject(nodeOrRect);
    // use `getInternalNode` (not getNode): `nodeToRect` below needs `internals`/`measured`, which live on
    // the InternalNode, not the user `Node` that getNode returns
    const node = isRectObj ? null : isInternalNode(nodeOrRect) ? nodeOrRect : getInternalNode(nodeOrRect.id);

    if (!isRectObj && !node) {
      return [null, null, isRectObj];
    }

    const nodeRect = isRectObj ? nodeOrRect : nodeToRect(node!);

    return [nodeRect, node, isRectObj];
  };

  const getIntersectingNodes: Actions<NodeType>['getIntersectingNodes'] = (
    nodeOrRect,
    partially = true,
    // defaults to the enriched InternalNodes — intersection geometry needs `internals`/`measured`
    nodes = Array.from(nodeLookup.values()),
  ) => {
    const [nodeRect, node, isRect] = getNodeRect(nodeOrRect);

    if (!nodeRect) {
      return [];
    }

    const intersections: InternalNode<NodeType>[] = [];
    for (const n of nodes) {
      if (!isRect && (n.id === node!.id || !n.internals.positionAbsolute)) {
        continue;
      }

      const currNodeRect = nodeToRect(n);
      const overlappingArea = getOverlappingArea(currNodeRect, nodeRect);
      const partiallyVisible = partially && overlappingArea > 0;

      if (
        partiallyVisible
        || overlappingArea >= currNodeRect.width * currNodeRect.height
        || overlappingArea >= Number(nodeRect.width) * Number(nodeRect.height)
      ) {
        intersections.push(n);
      }
    }

    return intersections;
  };

  const isNodeIntersecting: Actions<NodeType>['isNodeIntersecting'] = (nodeOrRect, area, partially = true) => {
    const [nodeRect] = getNodeRect(nodeOrRect);

    if (!nodeRect) {
      return false;
    }

    const overlappingArea = getOverlappingArea(nodeRect, area);
    const partiallyVisible = partially && overlappingArea > 0;

    // "intersecting" when partially overlapping (if `partially`) OR fully contained either way — the node
    // inside the area, or the area inside the node (the latter was missing; xyflow/react #5482)
    return (
      partiallyVisible
      || overlappingArea >= area.width * area.height
      || overlappingArea >= Number(nodeRect.width) * Number(nodeRect.height)
    );
  };

  const panBy: Actions<NodeType>['panBy'] = (delta) => {
    const { transform, dimensions, translateExtent, panZoom } = state;

    return panBySystem({ delta, panZoom, transform, translateExtent, ...dimensions });
  };

  const setState: Actions<NodeType, EdgeType>['setState'] = (options) => {
    const opts = typeof options === 'function' ? options(state) : options;

    // these options cannot be set after initialization
    const exclude: (keyof typeof opts)[] = ['viewportRef', 'vueFlowRef', 'dimensions', 'hooks'];

    // we need to set the default opts before setting any elements so the options are applied to the elements on first render
    if (isDef(opts.defaultEdgeOptions)) {
      state.defaultEdgeOptions = opts.defaultEdgeOptions;
    }

    // the `fitView` prop maps to the internal `fitViewOnInit` flag (kept separate from the `fitView()`
    // action); skipped from the generic loop above via `storeOptionsToSkip`
    if (isDef(opts.fitView)) {
      state.fitViewOnInit = opts.fitView;
    }

    if (isDef(opts.nodes)) {
      setNodes(opts.nodes);
    }

    if (isDef(opts.edges)) {
      setEdges(opts.edges);
    }

    const setSkippedOptions = () => {
      if (isDef(opts.maxZoom)) {
        setMaxZoom(opts.maxZoom);
      }
      if (isDef(opts.minZoom)) {
        setMinZoom(opts.minZoom);
      }
      if (isDef(opts.translateExtent)) {
        setTranslateExtent(opts.translateExtent);
      }
      // route through the setter (recomputes absolute positions) instead of the raw generic-loop
      // assignment — runs after `setNodes`, so preloaded nodes get re-clamped to the extent
      if (isDef(opts.nodeExtent)) {
        setNodeExtent(opts.nodeExtent);
      }
    };

    for (const o of Object.keys(opts)) {
      const key = o as keyof State;
      const option = opts[key];

      if (![...storeOptionsToSkip, ...exclude].includes(key) && isDef(option)) {
        ;(<any>state)[key] = option;
      }
    }

    // min/max-zoom + translateExtent setters are panZoom-null-safe (they always write state, and
    // `XYPanZoom` reads those state values when it mounts), so apply them directly — no need to wait
    // for the panZoom instance to exist.
    setSkippedOptions();

    if (!state.initialized) {
      state.initialized = true;
    }
  };

  // Mirror xyflow/react's `toObject`: shallow-clone each node/edge and read the viewport off the transform.
  // No field stripping (notably `measured` is kept, so a restored flow renders immediately instead of
  // staying `visibility: hidden` until re-measured) and no JSON round-trip — the nodes/edges are already
  // plain `markRaw`'d user objects, and callers that persist the result serialize it (`JSON.stringify(...)`).
  const toObject: Actions<NodeType>['toObject'] = () => ({
    nodes: state.nodes.map(node => ({ ...node })),
    edges: state.edges.map(edge => ({ ...edge })),
    viewport: { x: state.transform[0], y: state.transform[1], zoom: state.transform[2] },
  });

  const $reset: Actions<NodeType, EdgeType>['$reset'] = () => {
    const { nodes: _nodes, edges: _edges, ...resetState } = useState<NodeType, EdgeType>();

    commitEdges([]);
    commitNodes([]);

    if (state.panZoom) {
      state.panZoom.setViewport({
        x: state.defaultViewport.x ?? 0,
        y: state.defaultViewport.y ?? 0,
        zoom: state.defaultViewport.zoom ?? 1,
      });
    }

    setState(resetState);
  };

  return {
    updateNodePositions,
    updateNodeDimensions,
    setNodes,
    setEdges,
    addNodes,
    addEdges,
    removeNodes,
    removeEdges,
    deleteElements,
    getNode,
    getInternalNode,
    getEdge,
    reconnectEdge,
    updateEdge,
    updateEdgeData,
    updateNode,
    updateNodeData,
    applyEdgeChanges,
    applyNodeChanges,
    addSelectedNodes,
    addSelectedEdges,
    setMinZoom,
    setMaxZoom,
    setTranslateExtent,
    setNodeExtent,
    setPaneClickDistance,
    removeSelectedNodes,
    removeSelectedEdges,
    resetSelectedElements,
    startConnection,
    updateConnection,
    endConnection,
    setInteractive,
    setState,
    getIntersectingNodes,
    getConnectedEdges,
    getHandleConnections,
    isNodeIntersecting,
    panBy,
    fitView: params => viewportHelper.value.fitView(params),
    zoomIn: transitionOpts => viewportHelper.value.zoomIn(transitionOpts),
    zoomOut: transitionOpts => viewportHelper.value.zoomOut(transitionOpts),
    zoomTo: (zoomLevel, transitionOpts) => viewportHelper.value.zoomTo(zoomLevel, transitionOpts),
    setViewport: (params, transitionOpts) => viewportHelper.value.setViewport(params, transitionOpts),
    getViewport: () => viewportHelper.value.getViewport(),
    setCenter: (x, y, opts) => viewportHelper.value.setCenter(x, y, opts),
    fitBounds: (params, opts) => viewportHelper.value.fitBounds(params, opts),
    screenToFlowPosition: params => viewportHelper.value.screenToFlowPosition(params),
    flowToScreenPosition: params => viewportHelper.value.flowToScreenPosition(params),
    toObject,
    updateNodeInternals,
    viewportInitialized: computed(() => viewportHelper.value.viewportInitialized),
    $reset,
    $destroy: () => {},
  };
}

import type {
  EdgeAddChange,
  EdgeRemoveChange,
  EdgeSelectionChange,
  NodeAddChange,
  NodeDimensionChange,
  NodePositionChange,
  NodeRemoveChange,
  Rect,
} from '@xyflow/system';
import type {
  Actions,
  Edge,
  EdgeLookup,
  InternalNode,
  Node,
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
  ErrorCode,
  getSelectionChanges,
  isDef,
  isInternalNode,
  isNode,
  reconnectEdgeAction,
  updateConnectionLookup,
  validateEdges,
  VueFlowError,
} from '../utils';
import { storeOptionsToSkip, useState } from './state';

export function useActions<NodeType extends Node = Node, EdgeType extends Edge = Edge>(
  state: State<NodeType, EdgeType>,
  nodeLookup: NodeLookup<NodeType>,
  parentLookup: Map<string, Map<string, InternalNode<NodeType>>>,
  edgeLookup: EdgeLookup<EdgeType>,
): Actions<NodeType, EdgeType> {
  const viewportHelper = useViewportHelper(state, nodeLookup);

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

  /**
   * Single write path for nodes: re-adopt into `nodeLookup`/`parentLookup` (reusing unchanged
   * `InternalNode`s by reference) and store the user nodes as `state.nodes`. Callers must pass NEW objects
   * for changed nodes — mutating in place keeps the reference, so adoption reuses the stale `InternalNode`.
   */
  function commitNodes(nodes: NodeType[]) {
    const {
      nodes: adopted,
      hasSelectedNodes,
    } = adoptNodes(nodes, systemNodeLookup, systemParentLookup, state.hooks.error.trigger, {
      nodeOrigin: state.nodeOrigin,
      nodeExtent: state.nodeExtent,
      elevateNodesOnSelect: state.elevateNodesOnSelect,
      zIndexMode: state.zIndexMode,
    });

    state.nodes = adopted;

    state.nodesSelectionActive = state.nodesSelectionActive && hasSelectedNodes;

    recomputeAbsolutePositions();
  }

  /**
   * Single write path for edges: stored verbatim (`edgeLookup` values are the same references as the
   * `state.edges` elements). `markRaw` keeps edges out of Vue's deep proxy; renders come from lookup key
   * changes + immutable replacement, like nodes.
   */
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

  /**
   * Recompute parent-aware absolute positions/z on the system lookup, then mirror into the reactive
   * lookups. Lookup-only — no write-back to `state.nodes`. The full `updateAbsolutePositions` pass only
   * runs when there are child nodes (adoption already clamps position/z for changed nodes) or `forceFullPass`.
   */
  function recomputeAbsolutePositions(forceFullPass = false) {
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

    return nodeLookup.get(id)?.internals.userNode as NodeType | undefined;
  };

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
      const lookupNode = getNode(node.id);
      const expandParentId = lookupNode?.expandParent ? lookupNode.parentId : undefined;

      const change: NodePositionChange = {
        id: node.id,
        type: 'position',
        dragging,
        positionAbsolute: node.internals.positionAbsolute,
      };

      if (changed) {
        // drag items already carry the parent-relative position (both drag paths subtract the parent offset)
        change.position = node.position;

        if (expandParentId) {
          // pin the child's relative position to >= 0; the parent grows to contain it instead
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

          // a freshly-measured `expandParent` child grows its parent to fit; re-clamp against the NEW
          // dimensions/extent first so a node that only grew isn't treated as overflowing
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

          // re-set a fresh entry so the markRaw lookup re-renders (in-place measured/handleBounds writes
          // aren't tracked; only the `.set` is). Into BOTH maps so their references don't diverge.
          const fresh = markRaw({ ...toRaw(node) });
          systemNodeLookup.set(node.id, fresh);
          nodeLookup.set(node.id, fresh);
        }
      }
    }

    if (parentExpandChildren.length > 0) {
      changes.push(...handleExpandParent(parentExpandChildren, systemNodeLookup, systemParentLookup, state.nodeOrigin));
    }

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
        const deletable = edge.deletable ?? state.defaultEdgeOptions?.deletable;
        if (isDef(deletable) ? deletable : true) {
          edgeChanges.push(createEdgeRemoveChange(edge.id));
        }
      }
    }

    // recursively collect all nested children
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
    const { nodes: matchingNodes, edges: matchingEdges } = await getElementsToRemove<NodeType, EdgeType>({
      nodesToRemove: nodes,
      edgesToRemove: edges,
      nodes: state.nodes,
      edges: state.edges,
      onBeforeDelete: state.onBeforeDelete ?? undefined,
    });

    if (matchingEdges.length) {
      state.hooks.edgesDelete.trigger(matchingEdges);
    }

    if (matchingNodes.length) {
      state.hooks.nodesDelete.trigger(matchingNodes);
    }

    if (matchingNodes.length || matchingEdges.length) {
      state.hooks.delete.trigger({ nodes: matchingNodes, edges: matchingEdges });
    }

    // `matchingNodes`/`matchingEdges` already include children + connected edges (post-`onBeforeDelete`),
    // so tell `removeNodes` not to re-expand them — that would bypass an `onBeforeDelete` that kept some.
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

    const next = state.edges.map(e => (e.id === id ? ((options.replace ? nextEdge : { ...e, ...nextEdge }) as EdgeType) : e));
    commitEdges(next);
  };

  const updateEdgeData: Actions<NodeType, EdgeType>['updateEdgeData'] = (id, dataUpdate, options = { replace: false }) => {
    const edge = getEdge(id);

    if (!edge) {
      return;
    }

    const nextData = typeof dataUpdate === 'function' ? dataUpdate(edge as EdgeType) : dataUpdate;

    const nextEdge = { ...edge, data: options.replace ? nextData : { ...edge.data, ...nextData } } as EdgeType;

    commitEdges(state.edges.map(item => (item.id === id ? nextEdge : item)));
  };

  const applyNodeChanges: Actions<NodeType>['applyNodeChanges'] = (changes) => {
    // apply changes immutably (new array, new objects only for changed nodes), then re-adopt via `commitNodes`
    const result = applyChanges(changes, state.nodes);
    commitNodes(result);
    return result;
  };

  const applyEdgeChanges: Actions<NodeType, EdgeType>['applyEdgeChanges'] = (changes) => {
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

    const next = state.nodes.map(n => (n.id === id ? ((options.replace ? nextNode : { ...n, ...nextNode }) as NodeType) : n));
    commitNodes(next);
  };

  const updateNodeData: Actions<NodeType>['updateNodeData'] = (id, dataUpdate, options = { replace: false }) => {
    const node = getInternalNode(id);

    if (!node) {
      return;
    }

    const nextData = typeof dataUpdate === 'function' ? dataUpdate(node) : dataUpdate;

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

    // the `fitView` prop maps to the internal `fitViewOnInit` flag (separate from the `fitView()` action)
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
      // route through the setter (recomputes absolute positions) so preloaded nodes get re-clamped to the extent
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

    setSkippedOptions();

    if (!state.initialized) {
      state.initialized = true;
    }
  };

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
    $destroy: () => {
    },
  };
}

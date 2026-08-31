import type {
  EdgeLookup,
  NodeLookup,
  PositionChange,
  Rect,
} from '@xyflow/system';
import type { Actions, Edge, InternalNode, Node, State } from '../types';
import type { Commit } from './commit';
import {
  addChange,
  changeParentNode,
  EdgeChangeset,
  getConnectedEdges as getConnectedEdgesBase,
  getElementsToRemove,
  getOverlappingArea,
  getSelectionChanges,
  handleExpandParent,
  initialConnection,
  isRectObject,
  NodeChangeset,
  nodeToRect,
  panBy as panBySystem,
  removeChange,
  updateNodeInternals as updateNodeInternalsSystem,
} from '@xyflow/system';
import { computed } from 'vue';
import { useViewportHelper } from '../composables';
import {
  areNodesInitialized,
  createSelectionChange,
  isDef,
  isInternalNode,
  isNode,
  reconnectEdgeAction,
  validateEdges,
} from '../utils';
import { resolveFitView } from './fitView';
import { useState } from './state';

export function useActions<NodeType extends Node = Node, EdgeType extends Edge = Edge>(
  state: State<NodeType, EdgeType>,
  nodeLookup: NodeLookup<InternalNode<NodeType>>,
  edgeLookup: EdgeLookup<EdgeType>,
  commit: Commit<NodeType, EdgeType>,
): Actions<NodeType, EdgeType> {
  const viewportHelper = useViewportHelper(state, nodeLookup);

  // the commit layer owns the write paths (`commitNodes`/`commitEdges`) and the system-side lookups; actions
  // route every node/edge mutation through it. `createVueFlowStore` builds it so the `nodeExtent` accessor
  // can reuse `commitNodes` too.
  const { systemNodeLookup, systemParentLookup, commitNodes, commitEdges, syncLookups } = commit;

  const updateNodeInternals: Actions<NodeType>['updateNodeInternals'] = (nodeId) => {
    state.hooks.updateNodeInternals.trigger(Array.isArray(nodeId) ? nodeId : [nodeId]);
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
    const changes = new NodeChangeset<NodeType>();
    const parentExpandChildren: { id: string; parentId: string; rect: Rect }[] = [];

    for (const node of dragItems) {
      const lookupNode = getNode(node.id);
      const expandParentId = lookupNode?.expandParent ? lookupNode.parentId : undefined;

      const change: PositionChange = {
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

      changes.add(change);
    }

    if (parentExpandChildren.length > 0) {
      changes.add(handleExpandParent(parentExpandChildren, systemNodeLookup, systemParentLookup, state.nodeOrigin));
    }

    if (changes.size) {
      state.hooks.nodesChange.trigger(changes);
    }
  };

  const updateNodeDimensions: Actions<NodeType>['updateNodeDimensions'] = (updates) => {
    if (!state.vueFlowRef) {
      return;
    }

    const { changes: systemChanges, updatedInternals } = updateNodeInternalsSystem(
      new Map(updates.map(update => [update.id, { id: update.id, nodeElement: update.nodeElement, force: update.forceUpdate }])),
      systemNodeLookup,
      systemParentLookup,
      state.vueFlowRef,
      state.nodeOrigin,
      state.nodeExtent,
      state.zIndexMode,
    );

    if (updatedInternals) {
      syncLookups();
    }

    if (systemChanges.length) {
      const changes = new NodeChangeset<NodeType>();
      for (const change of systemChanges) {
        changes.add(change);
      }
      state.hooks.nodesChange.trigger(changes);
    }

    if (state.fitViewQueued && areNodesInitialized(nodeLookup)) {
      resolveFitView(state, nodeLookup);
    }
  };

  const addSelectedNodes: Actions<NodeType>['addSelectedNodes'] = (nodes) => {
    if (state.multiSelectionActive) {
      const nodeChangeset = new NodeChangeset<NodeType>();
      nodes.forEach(node => nodeChangeset.add(createSelectionChange(node.id, true)));
      state.hooks.nodesChange.trigger(nodeChangeset);
      return;
    }

    const nodeChangeset = new NodeChangeset<NodeType>();
    const edgeChangeset = new EdgeChangeset<EdgeType>();

    nodeChangeset.add(getSelectionChanges(nodeLookup, new Set(nodes.map(n => n.id))));
    edgeChangeset.add(getSelectionChanges(edgeLookup));

    state.hooks.nodesChange.trigger(nodeChangeset);
    state.hooks.edgesChange.trigger(edgeChangeset);
  };

  const addSelectedEdges: Actions<NodeType, EdgeType>['addSelectedEdges'] = (edges) => {
    if (state.multiSelectionActive) {
      const changedEdges = new EdgeChangeset<EdgeType>();
      edges.forEach(edge => changedEdges.add(createSelectionChange(edge.id, true)));
      state.hooks.edgesChange.trigger(changedEdges);
      return;
    }

    const nodeChangeset = new NodeChangeset<NodeType>();
    const edgeChangeset = new EdgeChangeset<EdgeType>();

    nodeChangeset.add(getSelectionChanges(nodeLookup, new Set()));
    edgeChangeset.add(getSelectionChanges(edgeLookup, new Set(edges.map(e => e.id))));

    state.hooks.edgesChange.trigger(edgeChangeset);
    state.hooks.nodesChange.trigger(nodeChangeset);
  };

  const removeSelectedNodes: Actions<NodeType>['removeSelectedNodes'] = (nodes) => {
    const nodesToUnselect = nodes || state.nodes;
    const nodeChanges = new NodeChangeset<NodeType>();

    nodesToUnselect.filter(n => n.selected).forEach(n => nodeChanges.add(createSelectionChange(n.id, false)));

    if (nodeChanges.size) {
      state.hooks.nodesChange.trigger(nodeChanges);
    }
  };

  const removeSelectedEdges: Actions<NodeType, EdgeType>['removeSelectedEdges'] = (edges) => {
    const edgesToUnselect = edges || state.edges;

    const edgeChanges = new EdgeChangeset<EdgeType>();
    edgesToUnselect.filter(e => e.selected).forEach(e => edgeChanges.add(createSelectionChange(e.id, false)));

    if (edgeChanges.size) {
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
    state.minZoom = minZoom;
  };

  const setMaxZoom: Actions<NodeType>['setMaxZoom'] = (maxZoom) => {
    state.maxZoom = maxZoom;
  };

  const setTranslateExtent: Actions<NodeType>['setTranslateExtent'] = (translateExtent) => {
    state.translateExtent = translateExtent;
  };

  const setNodeExtent: Actions<NodeType>['setNodeExtent'] = (nodeExtent) => {
    state.nodeExtent = nodeExtent;
  };

  const setPaneClickDistance: Actions<NodeType>['setPaneClickDistance'] = (clickDistance) => {
    state.paneClickDistance = clickDistance;
  };

  const setInteractive: Actions<NodeType>['setInteractive'] = (isInteractive) => {
    state.nodesDraggable = isInteractive;
    state.nodesConnectable = isInteractive;
    state.elementsSelectable = isInteractive;
  };

  const setNodes: Actions<NodeType>['setNodes'] = (nodes) => {
    const nextNodes = typeof nodes === 'function' ? nodes(state.nodes) : nodes;

    commitNodes(nextNodes);
  };

  const setEdges: Actions<NodeType, EdgeType>['setEdges'] = (edges) => {
    const nextEdges = typeof edges === 'function' ? edges(state.edges) : edges;

    commitEdges(
      validateEdges<EdgeType>(
        nextEdges,
        state.isValidConnection,
        getInternalNode,
        state.hooks.error.trigger,
        state.defaultEdgeOptions,
        state.edges,
      ),
    );
  };

  const addNodes: Actions<NodeType>['addNodes'] = (nodes) => {
    let nextNodes = typeof nodes === 'function' ? nodes(state.nodes) : nodes;
    nextNodes = Array.isArray(nextNodes) ? nextNodes : [nextNodes];

    const changes = new NodeChangeset<NodeType>();

    for (const node of nextNodes) {
      if (!isNode(node)) {
        continue;
      }
      changes.add(addChange(node));
    }

    if (changes.size) {
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
      state.edges,
    );

    const changes = new EdgeChangeset<EdgeType>();

    for (const edge of validEdges) {
      changes.add(addChange(edge));
    }

    if (changes.size) {
      state.hooks.edgesChange.trigger(changes);
    }
  };

  const removeNodes: Actions<NodeType>['removeNodes'] = (
    nodes,
    removeConnectedEdges = true,
    removeChildren = false,
  ) => {
    const nextNodes = typeof nodes === 'function' ? nodes(state.nodes) : nodes;
    const nodesToRemove = Array.isArray(nextNodes) ? nextNodes : [nextNodes];

    const nodeChanges = new NodeChangeset<NodeType>();
    const edgeChanges = new EdgeChangeset<EdgeType>();

    function createEdgeRemovalChanges(nodes: Node[]) {
      const connectedEdges = getConnectedEdges(nodes);
      for (const edge of connectedEdges) {
        const deletable = edge.deletable ?? state.defaultEdgeOptions?.deletable;
        if (isDef(deletable) ? deletable : true) {
          edgeChanges.add(removeChange(edge.id));
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
          nodeChanges.add(removeChange(child.id));
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

      nodeChanges.add(removeChange(currNode.id));

      if (removeConnectedEdges) {
        createEdgeRemovalChanges([currNode as Node]);
      }

      if (removeChildren) {
        createChildrenRemovalChanges(currNode.id);
      }
    }

    if (edgeChanges.size) {
      state.hooks.edgesChange.trigger(edgeChanges);
    }

    if (nodeChanges.size) {
      state.hooks.nodesChange.trigger(nodeChanges);
    }
  };

  const removeEdges: Actions<NodeType, EdgeType>['removeEdges'] = (edges) => {
    const nextEdges = typeof edges === 'function' ? edges(state.edges) : edges;
    const edgesToRemove = Array.isArray(nextEdges) ? nextEdges : [nextEdges];

    const changes = new EdgeChangeset<EdgeType>();

    for (const item of edgesToRemove) {
      const currEdge = typeof item === 'string' ? getEdge(item) : item;

      if (!currEdge) {
        continue;
      }

      const deletable = currEdge.deletable ?? state.defaultEdgeOptions?.deletable;
      if (isDef(deletable) && !deletable) {
        continue;
      }

      changes.add(removeChange(typeof item === 'string' ? item : item.id));
    }

    if (changes.size) {
      state.hooks.edgesChange.trigger(changes);
    }
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

  const reconnectEdge: Actions<NodeType, EdgeType>['reconnectEdge'] = (
    oldEdge,
    newConnection,
    shouldReplaceId = true,
  ) => {
    const prevEdge = getEdge(oldEdge.id);

    if (!prevEdge) {
      return false;
    }

    // resolve by id, not identity — callers commonly pass stale references (e.g. an edge captured in an
    // event payload before an immutable change replaced the stored object)
    const prevEdgeIndex = state.edges.findIndex(edge => edge.id === oldEdge.id);

    const newEdge = reconnectEdgeAction(
      oldEdge,
      newConnection,
      prevEdge as EdgeType,
      shouldReplaceId,
      state.hooks.error.trigger,
    );

    if (newEdge) {
      const [validEdge] = validateEdges<EdgeType>(
        [newEdge as unknown as EdgeType],
        state.isValidConnection,
        getInternalNode,
        state.hooks.error.trigger,
        state.defaultEdgeOptions,
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

    const next = state.edges.map(e =>
      e.id === id ? ((options.replace ? nextEdge : { ...e, ...nextEdge }) as EdgeType) : e,
    );
    commitEdges(next);
  };

  const updateEdgeData: Actions<NodeType, EdgeType>['updateEdgeData'] = (
    id,
    dataUpdate,
    options = { replace: false },
  ) => {
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
    const result = changes.applyTo(state.nodes);
    commitNodes(result);
    return result;
  };

  const applyEdgeChanges: Actions<NodeType, EdgeType>['applyEdgeChanges'] = (changes) => {
    const result = changes.applyTo(state.edges);
    commitEdges(result);
    return result;
  };

  const updateNode: Actions<NodeType>['updateNode'] = (id, nodeUpdate, options = { replace: false }) => {
    const node = getInternalNode(id);

    if (!node) {
      return;
    }

    const nextNode = typeof nodeUpdate === 'function' ? nodeUpdate(node) : nodeUpdate;

    const next = state.nodes.map(n =>
      n.id === id ? ((options.replace ? nextNode : { ...n, ...nextNode }) as NodeType) : n,
    );
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

  const changeParent: Actions<NodeType>['changeParent'] = (nodeId, parentId) => {
    changeParentNode(nodeId, nodeLookup, parentId, state.nodeOrigin, ({ nodeId, parentId, x, y }) => {
      updateNode(nodeId, {
        parentId: parentId ?? undefined,
        position: { x, y },
      } as Partial<NodeType>);
    });
  };

  const updateConnection: Actions<NodeType>['updateConnection'] = (connection) => {
    state.connection = connection;
  };

  const cancelConnection: Actions<NodeType>['cancelConnection'] = () => {
    state.connection = initialConnection;
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

    // `nodes`/`edges` are NOT settable through setState, use setNodes/setEdges instead.
    const skip = new Set<string>([
      'nodes',
      'edges',
      'fitView',
      'fitViewOnInitDone',
      'viewportRef',
      'vueFlowRef',
      'dimensions',
      'hooks',
    ]);

    // the `fitView` prop maps to the internal `fitViewOnInit` flag (separate from the `fitView()` action)
    if (isDef(opts.fitView)) {
      state.fitViewOnInit = opts.fitView;
    }

    for (const key of Object.keys(opts)) {
      if (skip.has(key)) {
        continue;
      }
      const option = (opts as any)[key];
      if (isDef(option)) {
        (<any>state)[key] = option;
      }
    }
  };

  const toObject: Actions<NodeType>['toObject'] = () => ({
    nodes: state.nodes.map(node => ({ ...node })),
    edges: state.edges.map(edge => ({ ...edge })),
    viewport: { x: state.transform[0], y: state.transform[1], zoom: state.transform[2] },
  });

  const reset: Actions<NodeType, EdgeType>['reset'] = () => {
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
    changeParent,
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
    updateConnection,
    cancelConnection,
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
    reset,
  };
}

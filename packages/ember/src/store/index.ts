import { tracked } from '@glimmer/tracking';
import {
  clampPosition,
  infiniteExtent,
  adoptUserNodes,
  getInternalNodesBounds,
  getOverlappingArea,
  getElementsToRemove,
  getNodesBounds as getNodesBoundsSystem,
  getViewportForBounds,
  isCoordinateExtent,
  isRectObject,
  panBy as panBySystem,
  snapPosition,
  calculateNodePosition,
  updateConnectionLookup,
  initialConnection,
  type CoordinateExtent,
  type ConnectionState,
  type ConnectionLookup,
  type EdgeLookup,
  type FitBoundsOptions,
  type HandleConnection,
  type HandleType,
  type SetCenterOptions,
  type InternalNodeBase,
  type NodeConnection,
  type NodeLookup,
  type NodeOrigin,
  type PanZoomInstance,
  type ParentLookup,
  type Rect,
  type SnapGrid,
  type Viewport,
  type ViewportHelperFunctionOptions,
  type XYPosition,
  type ZIndexMode,
  pointToRendererPoint,
  rendererPointToPoint,
} from '@xyflow/system';

import type { Edge, EdgeChange, FitViewOptions, Node, NodeChange } from '../types.js';
import type { OnBeforeDelete, OnDelete, OnEdgesDelete, OnNodesDelete } from '../types.js';

interface DeleteElementsOptions<NodeType extends Node, EdgeType extends Edge> {
  nodes: NodeType[];
  edges: EdgeType[];
  nodesDeletable: boolean;
}

interface DeleteElementsResult<NodeType extends Node, EdgeType extends Edge> {
  nodeChanges: NodeChange<NodeType>[];
  edgeChanges: EdgeChange<EdgeType>[];
}

interface DeleteElementsParams<NodeType extends Node, EdgeType extends Edge> {
  nodes?: (NodeType | { id: string })[];
  edges?: (EdgeType | { id: string })[];
}

interface DeleteElementsApiResult<NodeType extends Node, EdgeType extends Edge> {
  deletedNodes: NodeType[];
  deletedEdges: EdgeType[];
  nodeChanges: NodeChange<NodeType>[];
  edgeChanges: EdgeChange<EdgeType>[];
}

interface DeleteLifecycleCallbacks<NodeType extends Node, EdgeType extends Edge> {
  onBeforeDelete?: OnBeforeDelete<NodeType, EdgeType>;
  onNodesDelete?: OnNodesDelete<NodeType>;
  onEdgesDelete?: OnEdgesDelete<EdgeType>;
  onDelete?: OnDelete<NodeType, EdgeType>;
}

type ElementsUpdater<ElementType> = ElementType[] | ((elements: ElementType[]) => ElementType[]);
type ElementPayload<ElementType> = ElementType | ElementType[];
type UpdateOptions = {
  replace?: boolean;
};

export default class EmberFlowStore<NodeType extends Node = Node, EdgeType extends Edge = Edge> {
  viewport: Viewport;
  panZoom: PanZoomInstance | null = null;
  domNode: HTMLDivElement | null = null;
  translateExtent: CoordinateExtent = [
    [-Infinity, -Infinity],
    [Infinity, Infinity],
  ];
  nodeOrigin: NodeOrigin = [0, 0];
  nodeExtent: CoordinateExtent = infiniteExtent;
  zIndexMode: ZIndexMode = 'basic';
  elevateNodesOnSelect = true;
  @tracked width = 0;
  @tracked height = 0;
  minZoom = 0.5;
  maxZoom = 2;
  snapToGrid = false;
  snapGrid: SnapGrid = [15, 15];
  autoPanOnNodeDrag = true;
  autoPanOnConnect = true;
  autoPanSpeed = 15;

  @tracked nodesDraggable = true;
  @tracked nodesConnectable = true;
  @tracked elementsSelectable = true;

  readonly nodeLookup: NodeLookup<InternalNodeBase<NodeType>> = new Map();
  readonly parentLookup: ParentLookup<InternalNodeBase<NodeType>> = new Map();
  readonly edgeLookup: EdgeLookup<EdgeType> = new Map();
  readonly connectionLookup: ConnectionLookup = new Map();

  @tracked revision = 0;
  nodesInitialized = false;
  @tracked connection: ConnectionState<InternalNodeBase<NodeType>> = initialConnection;

  readonly selectedNodeIds = new Set<string>();
  readonly selectedEdgeIds = new Set<string>();
  readonly deletedNodeIds = new Set<string>();
  readonly deletedEdgeIds = new Set<string>();
  readonly pressedKeys = new Set<string>();
  readonly nodePositions = new Map<string, XYPosition>();
  readonly nodeDimensions = new Map<string, { width: number; height: number }>();
  private readonly viewportListeners = new Set<(viewport: Viewport) => void>();
  private readonly nodeGeometryListeners = new Set<(nodeId: string) => void>();
  private readonly graphListeners = new Set<(store: this) => void>();
  private readonly connectionListeners = new Set<(connection: ConnectionState<InternalNodeBase<NodeType>>) => void>();
  private readonly keyListeners = new Set<(keys: Set<string>) => void>();
  private deleteCallbacks: DeleteLifecycleCallbacks<NodeType, EdgeType> = {};
  private cancelConnectionCallback: (() => void) | undefined;

  private addedNodes: NodeType[] = [];
  private addedEdges: EdgeType[] = [];
  private nodeUpdates = new Map<string, NodeType>();
  private edgeUpdates = new Map<string, EdgeType>();
  private nodesOverride: NodeType[] | undefined;
  private edgesOverride: EdgeType[] | undefined;
  private syncCache:
    | {
        revision: number;
        sourceNodes: NodeType[];
        sourceEdges: EdgeType[];
        nodes: NodeType[];
        edges: EdgeType[];
      }
    | undefined;
  private currentSourceNodes: NodeType[] = [];
  private currentSourceEdges: EdgeType[] = [];

  constructor(initialViewport?: Viewport) {
    this.viewport = initialViewport ?? { x: 0, y: 0, zoom: 1 };
  }

  getNodes(sourceNodes: NodeType[] = this.currentSourceNodes): NodeType[] {
    this.currentSourceNodes = sourceNodes;
    return this.syncGraph(this.nodesOverride ?? sourceNodes, this.edgesOverride ?? this.currentSourceEdges).nodes;
  }

  getEdges(sourceEdges: EdgeType[] = this.currentSourceEdges): EdgeType[] {
    this.currentSourceEdges = sourceEdges;
    return this.syncGraph(this.nodesOverride ?? this.currentSourceNodes, this.edgesOverride ?? sourceEdges).edges;
  }

  syncGraph(sourceNodes: NodeType[] = [], sourceEdges: EdgeType[] = []) {
    this.revision;
    let cache = this.syncCache;

    if (
      cache &&
      cache.revision === this.revision &&
      cache.sourceNodes === sourceNodes &&
      cache.sourceEdges === sourceEdges
    ) {
      return {
        nodes: cache.nodes,
        edges: cache.edges,
      };
    }

    let nodes = this.materializeNodes(sourceNodes);
    let edges = this.materializeEdges(sourceEdges);

    let { nodesInitialized } = adoptUserNodes(nodes, this.nodeLookup, this.parentLookup, {
      nodeExtent: this.nodeExtent,
      nodeOrigin: this.nodeOrigin,
      elevateNodesOnSelect: this.elevateNodesOnSelect,
      checkEquality: true,
      zIndexMode: this.zIndexMode,
    });

    updateConnectionLookup(this.connectionLookup, this.edgeLookup, edges);
    this.nodesInitialized = nodesInitialized;
    this.syncCache = {
      revision: this.revision,
      sourceNodes,
      sourceEdges,
      nodes,
      edges,
    };

    return { nodes, edges };
  }

  get selectedNodes() {
    return Array.from(this.nodeLookup.values())
      .filter((node) => this.selectedNodeIds.has(node.id) || node.selected)
      .map((node) => node.internals.userNode);
  }

  get selectedEdges() {
    return Array.from(this.edgeLookup.values()).filter((edge) => this.selectedEdgeIds.has(edge.id) || edge.selected);
  }

  getInternalNode(id: string) {
    return this.nodeLookup.get(id);
  }

  getNode(id: string) {
    return this.nodeLookup.get(id)?.internals.userNode;
  }

  getEdge(id: string) {
    return this.edgeLookup.get(id);
  }

  getConnectedEdges(nodeId: string): EdgeType[] {
    let connections = this.connectionLookup.get(nodeId);
    if (!connections) {
      return [];
    }

    let seen = new Set<string>();
    let edges: EdgeType[] = [];

    for (let connection of connections.values()) {
      if (seen.has(connection.edgeId)) {
        continue;
      }

      let edge = this.edgeLookup.get(connection.edgeId);
      if (edge) {
        seen.add(connection.edgeId);
        edges.push(edge);
      }
    }

    return edges;
  }

  getInternalNodesBounds(): Rect {
    return getInternalNodesBounds(this.nodeLookup, {
      filter: (node) => !node.hidden,
    });
  }

  getNodesBounds(nodes: (NodeType | InternalNodeBase<NodeType> | string)[]): Rect {
    return getNodesBoundsSystem(nodes, {
      nodeLookup: this.nodeLookup,
      nodeOrigin: this.nodeOrigin,
    });
  }

  setNodes(payload: ElementsUpdater<NodeType>) {
    let currentNodes = this.getNodes();
    let nextNodes = typeof payload === 'function' ? payload(currentNodes) : payload;

    this.nodesOverride = [...nextNodes];
    this.addedNodes = [];
    this.nodeUpdates.clear();
    this.deletedNodeIds.clear();
    this.nodePositions.clear();
    this.nodeDimensions.clear();
    this.bump();
  }

  setEdges(payload: ElementsUpdater<EdgeType>) {
    let currentEdges = this.getEdges();
    let nextEdges = typeof payload === 'function' ? payload(currentEdges) : payload;

    this.edgesOverride = [...nextEdges];
    this.addedEdges = [];
    this.edgeUpdates.clear();
    this.deletedEdgeIds.clear();
    this.bump();
  }

  addNodes(payload: ElementPayload<NodeType>) {
    let nodes = Array.isArray(payload) ? payload : [payload];

    for (let node of nodes) {
      this.deletedNodeIds.delete(node.id);
      this.nodeUpdates.delete(node.id);
      this.nodePositions.delete(node.id);
      this.nodeDimensions.delete(node.id);
    }

    if (this.nodesOverride) {
      this.nodesOverride = this.upsertElementsById(this.nodesOverride, nodes);
    } else {
      let sourceNodes = this.currentSourceNodes;
      let addedNodes = [...this.addedNodes];

      for (let node of nodes) {
        if (sourceNodes.some((sourceNode) => sourceNode.id === node.id)) {
          this.nodeUpdates.set(node.id, node);
        } else {
          addedNodes = this.upsertElementsById(addedNodes, [node]);
        }
      }

      this.addedNodes = addedNodes;
    }

    this.bump();
  }

  addEdges(payload: ElementPayload<EdgeType>) {
    let edges = Array.isArray(payload) ? payload : [payload];

    for (let edge of edges) {
      this.deletedEdgeIds.delete(edge.id);
      this.edgeUpdates.delete(edge.id);
    }

    if (this.edgesOverride) {
      this.edgesOverride = this.upsertElementsById(this.edgesOverride, edges);
    } else {
      let sourceEdges = this.currentSourceEdges;
      let addedEdges = [...this.addedEdges];

      for (let edge of edges) {
        if (sourceEdges.some((sourceEdge) => sourceEdge.id === edge.id)) {
          this.edgeUpdates.set(edge.id, edge);
        } else {
          addedEdges = this.upsertElementsById(addedEdges, [edge]);
        }
      }

      this.addedEdges = addedEdges;
    }

    this.bump();
  }

  private upsertElementsById<ElementType extends { id: string }>(
    elements: ElementType[],
    updates: ElementType[]
  ): ElementType[] {
    let nextElements = [...elements];

    for (let update of updates) {
      let index = nextElements.findIndex((element) => element.id === update.id);

      if (index >= 0) {
        nextElements[index] = update;
      } else {
        nextElements.push(update);
      }
    }

    return nextElements;
  }

  updateNode(
    id: string,
    nodeUpdate: Partial<NodeType> | ((node: NodeType) => Partial<NodeType>),
    options: UpdateOptions = { replace: false }
  ) {
    let currentNode = this.nodeUpdates.get(id) ?? this.getNode(id);
    if (!currentNode) {
      return;
    }

    let nextUpdate = typeof nodeUpdate === 'function' ? nodeUpdate(currentNode) : nodeUpdate;
    let nextNode = options.replace ? (nextUpdate as NodeType) : ({ ...currentNode, ...nextUpdate } as NodeType);

    this.nodeUpdates.set(id, nextNode);

    if (nextNode.position) {
      this.nodePositions.set(id, this.roundPosition(nextNode.position));
    }
    if (nextNode.width !== undefined || nextNode.height !== undefined || nextNode.measured) {
      this.nodeDimensions.set(id, {
        width: nextNode.width ?? nextNode.measured?.width ?? this.getNodeWidth(currentNode),
        height: nextNode.height ?? nextNode.measured?.height ?? this.getNodeHeight(currentNode),
      });
    }

    this.bump();
  }

  updateNodeData(
    id: string,
    dataUpdate: Partial<NodeType['data']> | ((node: NodeType) => Partial<NodeType['data']>),
    options: UpdateOptions = { replace: false }
  ) {
    this.updateNode(id, (node) => {
      let nextData = typeof dataUpdate === 'function' ? dataUpdate(node) : dataUpdate;

      return {
        data: options.replace ? nextData : { ...node.data, ...nextData },
      } as Partial<NodeType>;
    });
  }

  updateEdge(
    id: string,
    edgeUpdate: Partial<EdgeType> | ((edge: EdgeType) => Partial<EdgeType>),
    options: UpdateOptions = { replace: false }
  ) {
    let currentEdge = this.edgeUpdates.get(id) ?? this.getEdge(id);
    if (!currentEdge) {
      return;
    }

    let nextUpdate = typeof edgeUpdate === 'function' ? edgeUpdate(currentEdge) : edgeUpdate;
    let nextEdge = options.replace ? (nextUpdate as EdgeType) : ({ ...currentEdge, ...nextUpdate } as EdgeType);

    this.edgeUpdates.set(id, nextEdge);
    this.bump();
  }

  updateEdgeData(
    id: string,
    dataUpdate: Partial<EdgeType['data']> | ((edge: EdgeType) => Partial<EdgeType['data']>),
    options: UpdateOptions = { replace: false }
  ) {
    this.updateEdge(id, (edge) => {
      let nextData = typeof dataUpdate === 'function' ? dataUpdate(edge) : dataUpdate;

      return {
        data: options.replace ? nextData : { ...edge.data, ...nextData },
      } as Partial<EdgeType>;
    });
  }

  setDeleteCallbacks(callbacks: DeleteLifecycleCallbacks<NodeType, EdgeType>) {
    this.deleteCallbacks = callbacks;
  }

  setCancelConnectionCallback(callback: (() => void) | undefined) {
    this.cancelConnectionCallback = callback;
  }

  cancelConnection() {
    this.cancelConnectionCallback?.();
    this.setConnection(initialConnection);
  }

  async deleteElements({
    nodes: nodesToRemove = [],
    edges: edgesToRemove = [],
  }: DeleteElementsParams<NodeType, EdgeType>): Promise<DeleteElementsApiResult<NodeType, EdgeType>> {
    let nodes = this.getNodes();
    let edges = this.getEdges();
    let { nodes: deletedNodes, edges: deletedEdges } = await getElementsToRemove({
      nodesToRemove,
      edgesToRemove,
      nodes,
      edges,
      onBeforeDelete: this.deleteCallbacks.onBeforeDelete,
    } as {
      nodesToRemove: Partial<NodeType>[];
      edgesToRemove: Partial<EdgeType>[];
      nodes: NodeType[];
      edges: EdgeType[];
      onBeforeDelete?: OnBeforeDelete<NodeType, EdgeType>;
    });
    let nodeChanges = deletedNodes.map((node) => ({ id: node.id, type: 'remove' }) as NodeChange<NodeType>);
    let edgeChanges = deletedEdges.map((edge) => ({ id: edge.id, type: 'remove' }) as EdgeChange<EdgeType>);

    if (deletedNodes.length === 0 && deletedEdges.length === 0) {
      return { deletedNodes, deletedEdges, nodeChanges, edgeChanges };
    }

    for (let node of deletedNodes) {
      this.deletedNodeIds.add(node.id);
      this.selectedNodeIds.delete(node.id);
      this.nodeUpdates.delete(node.id);
    }

    for (let edge of deletedEdges) {
      this.deletedEdgeIds.add(edge.id);
      this.selectedEdgeIds.delete(edge.id);
      this.edgeUpdates.delete(edge.id);
    }

    if (deletedEdges.length > 0) {
      this.deleteCallbacks.onEdgesDelete?.(deletedEdges);
    }

    if (deletedNodes.length > 0) {
      this.deleteCallbacks.onNodesDelete?.(deletedNodes);
    }

    this.deleteCallbacks.onDelete?.({ nodes: deletedNodes, edges: deletedEdges });
    this.bump();

    return { deletedNodes, deletedEdges, nodeChanges, edgeChanges };
  }

  getIntersectingNodes(nodeOrRect: NodeType | { id: string } | Rect, partially = true, nodes?: NodeType[]) {
    let isRect = isRectObject(nodeOrRect);
    let nodeRect: Rect | null;
    let nodeId: string | null;

    if (isRect) {
      nodeRect = nodeOrRect as Rect;
      nodeId = null;
    } else {
      let nodeOrId = nodeOrRect as NodeType | { id: string };
      nodeRect = this.getNodeRect(nodeOrId);
      nodeId = nodeOrId.id;
    }

    if (!nodeRect) {
      return [];
    }

    return (nodes ?? this.getNodes()).filter((node) => {
      if (nodeId && node.id === nodeId) {
        return false;
      }

      let currentNodeRect = this.getRenderedNodeBounds(node);
      let overlappingArea = getOverlappingArea(currentNodeRect, nodeRect);
      let partiallyVisible = partially && overlappingArea > 0;

      return (
        partiallyVisible ||
        overlappingArea >= currentNodeRect.width * currentNodeRect.height ||
        overlappingArea >= nodeRect.width * nodeRect.height
      );
    });
  }

  isNodeIntersecting(nodeOrRect: NodeType | { id: string } | Rect, area: Rect, partially = true) {
    let isRect = isRectObject(nodeOrRect);
    let nodeRect = isRect ? (nodeOrRect as Rect) : this.getNodeRect(nodeOrRect as NodeType | { id: string });

    if (!nodeRect) {
      return false;
    }

    let overlappingArea = getOverlappingArea(nodeRect, area);
    let partiallyVisible = partially && overlappingArea > 0;

    return (
      partiallyVisible ||
      overlappingArea >= area.width * area.height ||
      overlappingArea >= nodeRect.width * nodeRect.height
    );
  }

  getHandleConnections({ type, id, nodeId }: { type: HandleType; nodeId: string; id?: string | null }) {
    return Array.from(
      this.connectionLookup.get(`${nodeId}-${type}${id ? `-${id}` : ''}`)?.values() ?? []
    ) as HandleConnection[];
  }

  getNodeConnections({ type, handleId, nodeId }: { type?: HandleType; nodeId: string; handleId?: string | null }) {
    return Array.from(
      this.connectionLookup.get(`${nodeId}${type ? (handleId ? `-${type}-${handleId}` : `-${type}`) : ''}`)?.values() ??
        []
    ) as NodeConnection[];
  }

  private materializeNodes(sourceNodes: NodeType[] = []): NodeType[] {
    return ([...sourceNodes, ...this.addedNodes] as NodeType[])
      .filter((node) => !this.deletedNodeIds.has(node.id))
      .map((sourceNode) => {
        let node = this.nodeUpdates.get(sourceNode.id) ?? sourceNode;
        let position = this.nodePositions.get(node.id);
        let dimensions = this.nodeDimensions.get(node.id);
        let width = dimensions?.width ?? node.width ?? node.initialWidth ?? node.measured?.width;
        let height = dimensions?.height ?? node.height ?? node.initialHeight ?? node.measured?.height;
        let selected = this.selectedNodeIds.has(node.id) || node.selected;
        let measured =
          width !== undefined || height !== undefined
            ? {
                ...node.measured,
                ...(width !== undefined ? { width } : {}),
                ...(height !== undefined ? { height } : {}),
              }
            : node.measured;

        if (!position && !dimensions && selected === node.selected && measured === node.measured) {
          return node;
        }

        return {
          ...node,
          ...(position ? { position } : {}),
          ...(dimensions ? { width: dimensions.width, height: dimensions.height } : {}),
          ...(measured ? { measured } : {}),
          selected,
        };
      }) as NodeType[];
  }

  private materializeEdges(sourceEdges: EdgeType[] = []): EdgeType[] {
    return ([...sourceEdges, ...this.addedEdges] as EdgeType[])
      .map((sourceEdge) => this.edgeUpdates.get(sourceEdge.id) ?? sourceEdge)
      .filter(
        (edge) =>
          !this.deletedEdgeIds.has(edge.id) &&
          !this.deletedNodeIds.has(edge.source) &&
          !this.deletedNodeIds.has(edge.target)
      )
      .map((edge) => {
        let selected = this.selectedEdgeIds.has(edge.id) || edge.selected;

        if (selected === edge.selected) {
          return edge;
        }

        return {
          ...edge,
          selected,
        };
      }) as EdgeType[];
  }

  getViewport() {
    return { ...this.viewport };
  }

  getZoom() {
    return this.viewport.zoom;
  }

  setViewport(viewport: Viewport, options?: ViewportHelperFunctionOptions) {
    let nextViewport = this.normalizeViewport({
      x: viewport.x ?? this.viewport.x,
      y: viewport.y ?? this.viewport.y,
      zoom: viewport.zoom ?? this.viewport.zoom,
    });

    if (options && this.panZoom) {
      return this.panZoom.setViewport(nextViewport, options).then(() => true);
    }

    this.commitViewport(nextViewport, true);

    return Promise.resolve(true);
  }

  setViewportFromPanZoom(viewport: Viewport) {
    this.commitViewport(viewport, false);
  }

  private commitViewport(viewport: Viewport, syncPanZoom: boolean) {
    this.viewport = this.normalizeViewport(viewport);
    if (syncPanZoom) {
      this.syncPanZoomViewport();
    }
    this.notifyViewportListeners();
  }

  onViewportChange(callback: (viewport: Viewport) => void) {
    this.viewportListeners.add(callback);
    callback(this.viewport);

    return () => {
      this.viewportListeners.delete(callback);
    };
  }

  onNodeGeometryChange(callback: (nodeId: string) => void) {
    this.nodeGeometryListeners.add(callback);

    return () => {
      this.nodeGeometryListeners.delete(callback);
    };
  }

  onChange(callback: (store: this) => void) {
    this.graphListeners.add(callback);
    callback(this);

    return () => {
      this.graphListeners.delete(callback);
    };
  }

  subscribe(callback: (store: this) => void) {
    return this.onChange(callback);
  }

  onConnectionChange(callback: (connection: ConnectionState<InternalNodeBase<NodeType>>) => void) {
    this.connectionListeners.add(callback);
    callback(this.connection);

    return () => {
      this.connectionListeners.delete(callback);
    };
  }

  onKeyChange(callback: (keys: Set<string>) => void) {
    this.keyListeners.add(callback);
    callback(new Set(this.pressedKeys));

    return () => {
      this.keyListeners.delete(callback);
    };
  }

  setConnection(connection: ConnectionState<InternalNodeBase<NodeType>>) {
    this.connection = connection;
    for (let listener of this.connectionListeners) {
      listener(this.connection);
    }
  }

  syncPanZoomViewport() {
    this.panZoom?.syncViewport(this.viewport);
  }

  addPressedKey(key: string) {
    let previousSize = this.pressedKeys.size;
    this.pressedKeys.add(key);
    if (this.pressedKeys.size !== previousSize) {
      this.notifyKeyListeners();
    }
  }

  removePressedKey(key: string) {
    if (this.pressedKeys.delete(key)) {
      this.notifyKeyListeners();
    }
  }

  private notifyKeyListeners() {
    let keys = new Set(this.pressedKeys);
    for (let listener of this.keyListeners) {
      listener(keys);
    }
  }

  isMultiSelectionActive(configuredKey: string | string[] | null | undefined) {
    let keyConfig = configuredKey ?? 's';
    let keys = Array.isArray(keyConfig) ? keyConfig : [keyConfig];

    return keys.some((key) => key !== null && this.pressedKeys.has(key));
  }

  clearSelection() {
    let hadSelection = this.selectedNodeIds.size > 0 || this.selectedEdgeIds.size > 0;

    this.selectedNodeIds.clear();
    this.selectedEdgeIds.clear();

    if (hadSelection) {
      this.bump();
    }

    return hadSelection;
  }

  selectNode(id: string) {
    let wasSelected = this.selectedNodeIds.has(id);

    this.selectedNodeIds.add(id);

    if (!wasSelected) {
      this.bump();
    }

    return !wasSelected;
  }

  selectEdge(id: string) {
    let wasSelected = this.selectedEdgeIds.has(id);

    this.selectedEdgeIds.add(id);

    if (!wasSelected) {
      this.bump();
    }

    return !wasSelected;
  }

  addEdge(edge: EdgeType) {
    this.addEdges(edge);
  }

  setNodePosition(id: string, position: XYPosition, positionAbsolute?: XYPosition) {
    let rounded = {
      x: this.roundViewportValue(position.x),
      y: this.roundViewportValue(position.y),
    };

    this.nodePositions.set(id, rounded);
    this.syncInternalNodeGeometry(id, positionAbsolute);
    this.notifyNodeGeometryListeners(id);

    return rounded;
  }

  setNodeAbsolutePosition(id: string, node: Node, absolutePosition: XYPosition) {
    let constrainedPosition = this.constrainNodeAbsolutePosition(node, absolutePosition);
    let userPosition = this.absoluteToUserPosition(node, constrainedPosition);

    return {
      position: this.setNodePosition(id, userPosition, constrainedPosition),
      positionAbsolute: constrainedPosition,
    };
  }

  getNodePosition(node: Node): XYPosition {
    let position = this.getNodeUserPosition(node);
    let origin = this.getNodeOrigin(node);
    let localPosition = {
      x: position.x - this.getNodeWidth(node) * origin[0],
      y: position.y - this.getNodeHeight(node) * origin[1],
    };

    if (!node.parentId) {
      return localPosition;
    }

    let parent = this.currentSourceNodes.find((candidate) => candidate.id === node.parentId);
    if (!parent) {
      return localPosition;
    }

    let parentPosition: XYPosition = this.getNodePosition(parent);
    return {
      x: parentPosition.x + localPosition.x,
      y: parentPosition.y + localPosition.y,
    };
  }

  getNodeUserPosition(node: Node): XYPosition {
    return this.nodePositions.get(node.id) ?? node.position;
  }

  snapNodePosition(position: XYPosition) {
    return this.snapToGrid ? snapPosition(position, this.snapGrid) : position;
  }

  setSnapGrid(snapToGrid: boolean, snapGrid: SnapGrid) {
    this.snapToGrid = snapToGrid;
    this.snapGrid = snapGrid;
  }

  setAutoPanOptions({
    autoPanOnNodeDrag,
    autoPanOnConnect,
    autoPanSpeed,
  }: {
    autoPanOnNodeDrag?: boolean;
    autoPanOnConnect?: boolean;
    autoPanSpeed?: number;
  }) {
    this.autoPanOnNodeDrag = autoPanOnNodeDrag ?? true;
    this.autoPanOnConnect = autoPanOnConnect ?? true;
    this.autoPanSpeed = autoPanSpeed ?? 15;
  }

  setNodeOrigin(nodeOrigin: NodeOrigin) {
    this.nodeOrigin = nodeOrigin;
  }

  setNodeExtent(nodeExtent: CoordinateExtent) {
    this.nodeExtent = nodeExtent;
  }

  setTranslateExtent(translateExtent: CoordinateExtent) {
    this.translateExtent = translateExtent;
    this.panZoom?.setTranslateExtent(translateExtent);
  }

  private absoluteToUserPosition(node: Node, absolutePosition: XYPosition): XYPosition {
    let parentPosition = this.getParentAbsolutePosition(node);
    let origin = this.getNodeOrigin(node);

    return {
      x: absolutePosition.x - parentPosition.x + this.getNodeWidth(node) * origin[0],
      y: absolutePosition.y - parentPosition.y + this.getNodeHeight(node) * origin[1],
    };
  }

  private getParentAbsolutePosition(node: Node): XYPosition {
    if (!node.parentId) {
      return { x: 0, y: 0 };
    }

    let parent = this.currentSourceNodes.find((candidate) => candidate.id === node.parentId);
    return parent ? this.getNodePosition(parent) : { x: 0, y: 0 };
  }

  private getNodeOrigin(node: Node): NodeOrigin {
    return node.origin ?? this.nodeOrigin;
  }

  private constrainNodeAbsolutePosition(node: Node, absolutePosition: XYPosition) {
    let snappedPosition = this.snapNodePosition(absolutePosition);
    let extent = this.getNodeAbsoluteExtent(node);

    if (!extent) {
      return this.roundPosition(snappedPosition);
    }

    return this.roundPosition(
      clampPosition(snappedPosition, extent, {
        width: this.getNodeWidth(node),
        height: this.getNodeHeight(node),
      })
    );
  }

  private getNodeAbsoluteExtent(node: Node): CoordinateExtent | null {
    let parentPosition = this.getParentAbsolutePosition(node);

    if (node.extent === 'parent') {
      let parent = node.parentId
        ? this.currentSourceNodes.find((candidate) => candidate.id === node.parentId)
        : undefined;

      if (!parent) {
        return null;
      }

      return [
        [parentPosition.x, parentPosition.y],
        [parentPosition.x + this.getNodeWidth(parent), parentPosition.y + this.getNodeHeight(parent)],
      ];
    }

    if (isCoordinateExtent(node.extent)) {
      if (!node.parentId) {
        return node.extent;
      }

      return [
        [node.extent[0][0] + parentPosition.x, node.extent[0][1] + parentPosition.y],
        [node.extent[1][0] + parentPosition.x, node.extent[1][1] + parentPosition.y],
      ];
    }

    return isCoordinateExtent(this.nodeExtent) ? this.nodeExtent : null;
  }

  setNodeDimensions(id: string, dimensions: { width: number; height: number }) {
    let rounded = {
      width: this.roundViewportValue(dimensions.width),
      height: this.roundViewportValue(dimensions.height),
    };

    this.nodeDimensions.set(id, rounded);
    this.syncInternalNodeGeometry(id);
    this.notifyNodeGeometryListeners(id);

    return rounded;
  }

  updateNodeInternals(nodeId?: string | string[]) {
    let nodeIds = nodeId === undefined ? Array.from(this.nodeLookup.keys()) : Array.isArray(nodeId) ? nodeId : [nodeId];
    let didUpdate = false;

    for (let id of nodeIds) {
      let element = this.domNode?.querySelector<HTMLElement>(
        `.ember-flow__node[data-id="${this.escapeAttribute(id)}"]`
      );

      if (!element) {
        this.notifyNodeGeometryListeners(id);
        continue;
      }

      let width = element.offsetWidth;
      let height = element.offsetHeight;

      if (width > 0 && height > 0) {
        let currentNode = this.getNode(id);
        let currentWidth = currentNode ? this.getNodeWidth(currentNode) : 0;
        let currentHeight = currentNode ? this.getNodeHeight(currentNode) : 0;

        if (Math.abs(currentWidth - width) > 0.5 || Math.abs(currentHeight - height) > 0.5) {
          this.setNodeDimensions(id, { width, height });
          didUpdate = true;
        }
      }

      this.notifyNodeGeometryListeners(id);
    }

    if (didUpdate) {
      this.bump();
    }
  }

  moveSelectedNodes(direction: XYPosition, factor = 1): NodeChange<NodeType>[] {
    let changes: NodeChange<NodeType>[] = [];
    let xVelocity = this.snapToGrid ? this.snapGrid[0] : 5;
    let yVelocity = this.snapToGrid ? this.snapGrid[1] : 5;
    let xDiff = direction.x * xVelocity * factor;
    let yDiff = direction.y * yVelocity * factor;

    for (let internalNode of this.nodeLookup.values()) {
      let userNode = internalNode.internals.userNode;
      let isSelected = internalNode.selected || this.selectedNodeIds.has(internalNode.id) || userNode.selected;
      let isDraggable = userNode.draggable ?? this.nodesDraggable;

      if (!isSelected || !isDraggable) {
        continue;
      }

      let nextPosition = {
        x: internalNode.internals.positionAbsolute.x + xDiff,
        y: internalNode.internals.positionAbsolute.y + yDiff,
      };

      if (this.snapToGrid) {
        nextPosition = snapPosition(nextPosition, this.snapGrid);
      }

      let { position, positionAbsolute } = calculateNodePosition({
        nodeId: internalNode.id,
        nextPosition,
        nodeLookup: this.nodeLookup,
        nodeExtent: this.nodeExtent,
        nodeOrigin: this.nodeOrigin,
      });
      let roundedPosition = this.roundPosition(position);
      let roundedAbsolutePosition = this.roundPosition(positionAbsolute);
      let currentPosition = this.getNodeUserPosition(userNode);

      if (currentPosition.x === roundedPosition.x && currentPosition.y === roundedPosition.y) {
        continue;
      }

      internalNode.position = roundedPosition;
      internalNode.internals.positionAbsolute = roundedAbsolutePosition;
      this.nodePositions.set(internalNode.id, roundedPosition);
      this.notifyNodeGeometryListeners(internalNode.id);
      changes.push({
        id: internalNode.id,
        type: 'position',
        position: roundedPosition,
      } as NodeChange<NodeType>);
    }

    if (changes.length > 0) {
      this.bump();
    }

    return changes;
  }

  getNodeWidth(node: Node) {
    return this.nodeDimensions.get(node.id)?.width ?? node.width ?? node.initialWidth ?? node.measured?.width ?? 150;
  }

  getNodeHeight(node: Node) {
    return this.nodeDimensions.get(node.id)?.height ?? node.height ?? node.initialHeight ?? node.measured?.height ?? 40;
  }

  getRenderedNodeBounds(node: Node): Rect {
    let position = this.getNodePosition(node);

    return {
      x: position.x,
      y: position.y,
      width: this.getNodeWidth(node),
      height: this.getNodeHeight(node),
    };
  }

  getRenderedNodesBounds(nodes: Node[] = this.getNodes()): Rect {
    if (nodes.length === 0) {
      return { x: 0, y: 0, width: 1, height: 1 };
    }

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (let node of nodes) {
      let bounds = this.getRenderedNodeBounds(node);

      minX = Math.min(minX, bounds.x);
      minY = Math.min(minY, bounds.y);
      maxX = Math.max(maxX, bounds.x + bounds.width);
      maxY = Math.max(maxY, bounds.y + bounds.height);
    }

    return {
      x: minX,
      y: minY,
      width: Math.max(maxX - minX, 1),
      height: Math.max(maxY - minY, 1),
    };
  }

  deleteSelectedElements({
    nodes,
    edges,
    nodesDeletable,
  }: DeleteElementsOptions<NodeType, EdgeType>): DeleteElementsResult<NodeType, EdgeType> {
    let nodeChanges: NodeChange<NodeType>[] = [];
    let edgeChanges: EdgeChange<EdgeType>[] = [];

    if (nodesDeletable) {
      for (let id of [...this.selectedNodeIds]) {
        let node = nodes.find((candidate) => candidate.id === id);
        if (!node || node.deletable === false) {
          continue;
        }

        this.deletedNodeIds.add(id);
        this.selectedNodeIds.delete(id);
        nodeChanges.push({ id, type: 'remove' });

        for (let edge of edges) {
          if (edge.source === id || edge.target === id) {
            this.deletedEdgeIds.add(edge.id);
            this.selectedEdgeIds.delete(edge.id);
            edgeChanges.push({ id: edge.id, type: 'remove' });
          }
        }
      }
    }

    for (let id of [...this.selectedEdgeIds]) {
      let edge = edges.find((candidate) => candidate.id === id);
      if (!edge || edge.deletable === false) {
        continue;
      }

      this.deletedEdgeIds.add(id);
      this.selectedEdgeIds.delete(id);
      edgeChanges.push({ id, type: 'remove' });
    }

    if (nodeChanges.length > 0 || edgeChanges.length > 0) {
      this.bump();
    }

    return { nodeChanges, edgeChanges };
  }

  async panBy(delta: XYPosition) {
    let changed = await panBySystem({
      delta,
      panZoom: this.panZoom,
      transform: [this.viewport.x, this.viewport.y, this.viewport.zoom],
      translateExtent: this.translateExtent,
      width: this.width,
      height: this.height,
    });

    if (!this.panZoom) {
      this.setViewport({
        x: this.viewport.x + delta.x,
        y: this.viewport.y + delta.y,
        zoom: this.viewport.zoom,
      });
    }

    return changed;
  }

  setViewportDimensions(width: number, height: number) {
    if (this.width === width && this.height === height) {
      return;
    }

    this.width = width;
    this.height = height;
    this.bump();
  }

  setZoomExtent(minZoom: number, maxZoom: number) {
    this.minZoom = minZoom;
    this.maxZoom = maxZoom;
    this.panZoom?.setScaleExtent([minZoom, maxZoom]);
  }

  setInteractivity({
    nodesDraggable,
    nodesConnectable,
    elementsSelectable,
  }: {
    nodesDraggable?: boolean;
    nodesConnectable?: boolean;
    elementsSelectable?: boolean;
  }) {
    let changed = false;

    if (nodesDraggable !== undefined && this.nodesDraggable !== nodesDraggable) {
      this.nodesDraggable = nodesDraggable;
      changed = true;
    }

    if (nodesConnectable !== undefined && this.nodesConnectable !== nodesConnectable) {
      this.nodesConnectable = nodesConnectable;
      changed = true;
    }

    if (elementsSelectable !== undefined && this.elementsSelectable !== elementsSelectable) {
      this.elementsSelectable = elementsSelectable;
      changed = true;
    }

    if (changed) {
      this.bump();
    }
  }

  get isInteractive() {
    return this.nodesDraggable || this.nodesConnectable || this.elementsSelectable;
  }

  toggleInteractivity() {
    let interactive = !this.isInteractive;

    this.setInteractivity({
      nodesDraggable: interactive,
      nodesConnectable: interactive,
      elementsSelectable: interactive,
    });

    return interactive;
  }

  zoomBy(factor: number, options?: ViewportHelperFunctionOptions) {
    return this.panZoom?.scaleBy(factor, options) ?? Promise.resolve(false);
  }

  zoomIn(options?: ViewportHelperFunctionOptions) {
    return this.zoomBy(1.2, options);
  }

  zoomOut(options?: ViewportHelperFunctionOptions) {
    return this.zoomBy(1 / 1.2, options);
  }

  zoomTo(zoom: number, options?: ViewportHelperFunctionOptions) {
    return this.panZoom?.scaleTo(zoom, options) ?? Promise.resolve(false);
  }

  setZoom(zoom: number, options?: ViewportHelperFunctionOptions) {
    return this.zoomTo(zoom, options);
  }

  async setCenter(x: number, y: number, options?: SetCenterOptions) {
    if (!this.panZoom || this.width === 0 || this.height === 0) {
      return Promise.resolve(false);
    }

    let zoom = options?.zoom ?? this.maxZoom;

    await this.panZoom.setViewport(
      {
        x: this.width / 2 - x * zoom,
        y: this.height / 2 - y * zoom,
        zoom,
      },
      {
        duration: options?.duration,
        ease: options?.ease,
        interpolate: options?.interpolate,
      }
    );

    return Promise.resolve(true);
  }

  async fitView(options?: FitViewOptions<NodeType>) {
    if (!this.panZoom || this.width === 0 || this.height === 0) {
      return Promise.resolve(false);
    }

    let nodes = this.getFitViewNodes(options);

    if (nodes.length === 0) {
      return Promise.resolve(true);
    }

    let viewport = getViewportForBounds(
      this.getRenderedNodesBounds(nodes),
      this.width,
      this.height,
      options?.minZoom ?? this.minZoom,
      options?.maxZoom ?? this.maxZoom,
      options?.padding ?? 0.1
    );
    let normalizedViewport = this.normalizeViewport({
      ...viewport,
      x: Math.round(viewport.x),
      y: Math.round(viewport.y),
    });

    await this.panZoom.setViewport(normalizedViewport, {
      duration: options?.duration,
      ease: options?.ease,
      interpolate: options?.interpolate,
    });

    return Promise.resolve(true);
  }

  async fitBounds(bounds: Rect, options?: FitBoundsOptions) {
    if (!this.panZoom || this.width === 0 || this.height === 0) {
      return Promise.resolve(false);
    }

    let viewport = getViewportForBounds(
      bounds,
      this.width,
      this.height,
      this.minZoom,
      this.maxZoom,
      options?.padding ?? 0.1
    );

    await this.panZoom.setViewport(this.normalizeViewport(viewport), {
      duration: options?.duration,
      ease: options?.ease,
      interpolate: options?.interpolate,
    });

    return Promise.resolve(true);
  }

  private getFitViewNodes(options?: FitViewOptions<NodeType>) {
    let optionNodeIds = options?.nodes ? new Set(options.nodes.map((node) => node.id)) : null;

    return this.getNodes().filter((node) => {
      if (!options?.includeHiddenNodes && node.hidden) {
        return false;
      }

      return !optionNodeIds || optionNodeIds.has(node.id);
    });
  }

  screenToFlowPosition(clientPosition: XYPosition, options: { snapToGrid?: boolean; snapGrid?: SnapGrid } = {}) {
    if (!this.domNode) {
      return clientPosition;
    }

    let { x: domX, y: domY } = this.domNode.getBoundingClientRect();
    let shouldSnap = options.snapToGrid ?? this.snapToGrid;
    let snapGrid = options.snapGrid ?? this.snapGrid;

    return pointToRendererPoint(
      {
        x: clientPosition.x - domX,
        y: clientPosition.y - domY,
      },
      [this.viewport.x, this.viewport.y, this.viewport.zoom],
      shouldSnap,
      snapGrid
    );
  }

  flowToScreenPosition(flowPosition: XYPosition) {
    if (!this.domNode) {
      return flowPosition;
    }

    let { x: domX, y: domY } = this.domNode.getBoundingClientRect();
    let rendererPosition = rendererPointToPoint(flowPosition, [this.viewport.x, this.viewport.y, this.viewport.zoom]);

    return {
      x: rendererPosition.x + domX,
      y: rendererPosition.y + domY,
    };
  }

  toObject(sourceNodes: NodeType[] = this.currentSourceNodes, sourceEdges: EdgeType[] = this.currentSourceEdges) {
    return {
      nodes: this.getNodes(sourceNodes).map((node) => ({ ...node })),
      edges: this.getEdges(sourceEdges).map((edge) => ({ ...edge })),
      viewport: this.getViewport(),
    };
  }

  reset(initialViewport?: Viewport) {
    this.selectedNodeIds.clear();
    this.selectedEdgeIds.clear();
    this.deletedNodeIds.clear();
    this.deletedEdgeIds.clear();
    this.pressedKeys.clear();
    this.nodePositions.clear();
    this.nodeDimensions.clear();
    this.addedNodes = [];
    this.addedEdges = [];
    this.nodeUpdates.clear();
    this.edgeUpdates.clear();
    this.nodesOverride = undefined;
    this.edgesOverride = undefined;
    this.panZoom = null;
    this.viewport = initialViewport ?? { x: 0, y: 0, zoom: 1 };
    this.notifyViewportListeners();
    this.bump();
  }

  bump() {
    this.revision++;
    this.notifyGraphListeners();
  }

  private notifyGraphListeners() {
    for (let listener of this.graphListeners) {
      listener(this);
    }
  }

  normalizeViewport(viewport: Viewport): Viewport {
    return {
      x: this.roundViewportValue(viewport.x),
      y: this.roundViewportValue(viewport.y),
      zoom: this.roundViewportValue(viewport.zoom),
    };
  }

  roundViewportValue(value: number) {
    return Math.round(value * 1000) / 1000;
  }

  private roundPosition(position: XYPosition): XYPosition {
    return {
      x: this.roundViewportValue(position.x),
      y: this.roundViewportValue(position.y),
    };
  }

  private getNodeRect(nodeOrId: NodeType | { id: string }) {
    let node = 'position' in nodeOrId ? nodeOrId : this.getNode(nodeOrId.id);

    return node ? this.getRenderedNodeBounds(node) : null;
  }

  private notifyViewportListeners() {
    for (let listener of this.viewportListeners) {
      listener(this.viewport);
    }
  }

  private notifyNodeGeometryListeners(nodeId: string) {
    for (let listener of this.nodeGeometryListeners) {
      listener(nodeId);
    }
  }

  private escapeAttribute(value: string) {
    return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  }

  private syncInternalNodeGeometry(id: string, positionAbsolute?: XYPosition) {
    let internalNode = this.nodeLookup.get(id);
    if (!internalNode) {
      return;
    }

    let dimensions = this.nodeDimensions.get(id);
    let position = this.nodePositions.get(id);
    let nextMeasured =
      dimensions === undefined
        ? internalNode.measured
        : {
            ...internalNode.measured,
            width: dimensions.width,
            height: dimensions.height,
          };

    if (dimensions !== undefined) {
      internalNode.measured = nextMeasured;
      internalNode.width = dimensions.width;
      internalNode.height = dimensions.height;
    }

    if (position !== undefined) {
      internalNode.position = position;
      internalNode.internals.positionAbsolute =
        positionAbsolute ?? this.getNodePosition(internalNode.internals.userNode);
    }

    internalNode.internals.userNode = {
      ...internalNode.internals.userNode,
      ...(position !== undefined ? { position } : {}),
      ...(dimensions !== undefined
        ? {
            width: dimensions.width,
            height: dimensions.height,
            measured: nextMeasured,
          }
        : {}),
    };
  }
}

export type { DeleteElementsOptions, DeleteElementsResult };

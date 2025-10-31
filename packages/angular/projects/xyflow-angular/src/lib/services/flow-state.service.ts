import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, map, distinctUntilChanged } from 'rxjs';
import {
  adoptUserNodes,
  updateAbsolutePositions,
  panBy as panBySystem,
  updateNodeInternals as updateNodeInternalsSystem,
  updateConnectionLookup,
  handleExpandParent,
  NodeChange,
  EdgeChange,
  EdgeSelectionChange,
  NodeSelectionChange,
  ParentExpandChild,
  initialConnection,
  NodeOrigin,
  CoordinateExtent,
  fitViewport,
  Viewport,
  Connection,
  ConnectionState,
  XYPosition,
  PanZoomInstance,
  InternalNodeBase,
  NodeLookup,
  EdgeLookup,
  ConnectionLookup,
  Transform,
  type FitViewOptionsBase,
  type ViewportHelperFunctionOptions,
  type SetCenterOptions,
  type NodeBase,
  type EdgeBase,
  type OnError,
  type IsValidConnection,
  type OnConnect,
  type OnConnectStart,
  type OnConnectEnd,
  type OnReconnect,
  type NodeDragItem,
  type InternalNodeUpdate,
} from '@xyflow/system';

import { applyEdgeChanges, applyNodeChanges, createSelectionChange, getSelectionChanges } from '../utils/changes';
import { getInitialState } from './initial-state';
import type {
  AngularFlowState,
  UnselectNodesAndEdgesParams,
  FlowStateConfig,
  AngularFlowNode,
  AngularFlowEdge,
  AngularNodeTypes,
  AngularEdgeTypes
} from '../types/general';

@Injectable()
export class FlowStateService<NodeType extends AngularFlowNode = AngularFlowNode, EdgeType extends AngularFlowEdge = AngularFlowEdge> implements OnDestroy {
  // Unique flow instance identifier
  public readonly flowId: string = Math.random().toString(36).substr(2, 9);

  // Core state subjects
  private nodesSubject = new BehaviorSubject<NodeType[]>([]);
  private edgesSubject = new BehaviorSubject<EdgeType[]>([]);
  private viewportSubject = new BehaviorSubject<Viewport>({ x: 0, y: 0, zoom: 1 });
  private nodeTypesSubject = new BehaviorSubject<AngularNodeTypes>({});
  private edgeTypesSubject = new BehaviorSubject<AngularEdgeTypes>({});
  private connectionSubject = new BehaviorSubject<ConnectionState>(initialConnection);
  private transformSubject = new BehaviorSubject<Transform>([0, 0, 1]);
  private dimensionsSubject = new BehaviorSubject<{ width: number; height: number }>({ width: 0, height: 0 });

  // Internal state subjects
  private nodeLookupSubject = new BehaviorSubject<NodeLookup>(new Map());
  private edgeLookupSubject = new BehaviorSubject<EdgeLookup>(new Map());
  private connectionLookupSubject = new BehaviorSubject<ConnectionLookup>(new Map());
  private parentLookupSubject = new BehaviorSubject<Map<string, any>>(new Map());
  private panZoomSubject = new BehaviorSubject<PanZoomInstance | null>(null);

  // Configuration subjects
  private nodeOriginSubject = new BehaviorSubject<NodeOrigin>([0, 0]);
  private nodeExtentSubject = new BehaviorSubject<CoordinateExtent>([[-Infinity, -Infinity], [Infinity, Infinity]]);
  private minZoomSubject = new BehaviorSubject<number>(0.5);
  private maxZoomSubject = new BehaviorSubject<number>(2);
  private translateExtentSubject = new BehaviorSubject<CoordinateExtent>([[-Infinity, -Infinity], [Infinity, Infinity]]);
  private elementsSelectableSubject = new BehaviorSubject<boolean>(true);
  private nodesDraggableSubject = new BehaviorSubject<boolean>(true);
  private nodesConnectableSubject = new BehaviorSubject<boolean>(true);

  // Event handler subjects
  private onErrorSubject = new BehaviorSubject<OnError | null>(null);
  private isValidConnectionSubject = new BehaviorSubject<IsValidConnection | null>(null);
  private onConnectSubject = new BehaviorSubject<OnConnect | null>(null);
  private onConnectStartSubject = new BehaviorSubject<OnConnectStart | null>(null);
  private onConnectEndSubject = new BehaviorSubject<OnConnectEnd | null>(null);
  private onBeforeConnectSubject = new BehaviorSubject<OnReconnect | null>(null);

  // Connection line state subjects
  private connectionStartHandleSubject = new BehaviorSubject<{
    nodeId: string;
    handleId?: string;
    type: 'source' | 'target';
    position: { x: number; y: number };
  } | null>(null);
  private connectionPositionSubject = new BehaviorSubject<{ x: number; y: number } | null>(null);
  private connectionInProgressSubject = new BehaviorSubject<boolean>(false);

  // Selection state subjects
  private selectedNodesSubject = new BehaviorSubject<string[]>([]);
  private selectedEdgesSubject = new BehaviorSubject<string[]>([]);

  // FitView state
  private fitViewQueuedSubject = new BehaviorSubject<boolean>(false);
  private fitViewOptionsSubject = new BehaviorSubject<FitViewOptionsBase | undefined>(undefined);
  private fitViewResolverSubject = new BehaviorSubject<{ resolve: (value: boolean) => void } | null>(null);

  // Public observables
  readonly nodes$ = this.nodesSubject.asObservable();
  readonly edges$ = this.edgesSubject.asObservable();
  readonly viewport$ = this.viewportSubject.asObservable();
  readonly nodeTypes$ = this.nodeTypesSubject.asObservable();
  readonly edgeTypes$ = this.edgeTypesSubject.asObservable();
  readonly connection$ = this.connectionSubject.asObservable();
  readonly transform$ = this.transformSubject.asObservable();
  readonly dimensions$ = this.dimensionsSubject.asObservable();

  // Connection line observables
  readonly connectionStartHandle$ = this.connectionStartHandleSubject.asObservable();
  readonly connectionPosition$ = this.connectionPositionSubject.asObservable();
  readonly connectionInProgress$ = this.connectionInProgressSubject.asObservable();

  // Selection observables
  readonly selectedNodesIds$ = this.selectedNodesSubject.asObservable();
  readonly selectedEdgesIds$ = this.selectedEdgesSubject.asObservable();

  // Derived observables
  readonly selectedNodes$ = this.nodes$.pipe(
    map(nodes => nodes.filter(node => node.selected)),
    distinctUntilChanged()
  );

  readonly selectedEdges$ = this.edges$.pipe(
    map(edges => edges.filter(edge => edge.selected)),
    distinctUntilChanged()
  );

  readonly isInteractive$ = combineLatest([
    this.nodesDraggableSubject,
    this.nodesConnectableSubject,
    this.elementsSelectableSubject
  ]).pipe(
    map(([draggable, connectable, selectable]) => draggable || connectable || selectable),
    distinctUntilChanged()
  );

  // Internal state accessors (for compatibility with system package)
  get nodeLookup(): NodeLookup { return this.nodeLookupSubject.value; }
  get edgeLookup(): EdgeLookup { return this.edgeLookupSubject.value; }
  get connectionLookup(): ConnectionLookup { return this.connectionLookupSubject.value; }
  get parentLookup(): Map<string, string> { return this.parentLookupSubject.value; }
  get panZoom(): PanZoomInstance | null { return this.panZoomSubject.value; }

  // Current state accessors
  get nodes(): NodeType[] { return this.nodesSubject.value; }
  get edges(): EdgeType[] { return this.edgesSubject.value; }
  get viewport(): Viewport { return this.viewportSubject.value; }
  get nodeTypes(): AngularNodeTypes { return this.nodeTypesSubject.value; }
  get edgeTypes(): AngularEdgeTypes { return this.edgeTypesSubject.value; }
  get connection(): ConnectionState { return this.connectionSubject.value; }
  get transform(): Transform { return this.transformSubject.value; }
  get nodeOrigin(): NodeOrigin { return this.nodeOriginSubject.value; }
  get nodeExtent(): CoordinateExtent { return this.nodeExtentSubject.value; }
  get minZoom(): number { return this.minZoomSubject.value; }
  get maxZoom(): number { return this.maxZoomSubject.value; }
  get translateExtent(): CoordinateExtent { return this.translateExtentSubject.value; }
  get elementsSelectable(): boolean { return this.elementsSelectableSubject.value; }
  get nodesDraggable(): boolean { return this.nodesDraggableSubject.value; }
  get nodesConnectable(): boolean { return this.nodesConnectableSubject.value; }
  get width(): number { return this.dimensionsSubject.value.width; }
  get height(): number { return this.dimensionsSubject.value.height; }

  constructor() {
    this.initializeState();
  }

  ngOnDestroy(): void {
    // Clean up any subscriptions or resources
    this.reset();
  }

  private initializeState(): void {
    const initialState = getInitialState();

    // Initialize with default values
    this.nodesSubject.next(initialState.nodes as NodeType[]);
    this.edgesSubject.next(initialState.edges as EdgeType[]);
    this.viewportSubject.next(initialState.viewport);
    this.transformSubject.next(initialState.transform);
    this.nodeOriginSubject.next(initialState.nodeOrigin);
    this.nodeExtentSubject.next(initialState.nodeExtent);
    this.minZoomSubject.next(initialState.minZoom);
    this.maxZoomSubject.next(initialState.maxZoom);
    this.translateExtentSubject.next(initialState.translateExtent);
    this.elementsSelectableSubject.next(initialState.elementsSelectable);
    this.nodesDraggableSubject.next(initialState.nodesDraggable);
    this.nodesConnectableSubject.next(initialState.nodesConnectable);
  }

  // State setters
  setNodes(nodes: NodeType[]): void {
    const { nodeLookup, parentLookup, nodeOrigin, nodeExtent, elevateNodesOnSelect, fitViewQueued } = this.getCurrentState();

    const nodesInitialized = adoptUserNodes(nodes, nodeLookup, parentLookup as any, {
      nodeOrigin,
      nodeExtent,
      elevateNodesOnSelect,
      checkEquality: true,
    });

    if (fitViewQueued && nodesInitialized) {
      this.resolveFitView();
      this.fitViewQueuedSubject.next(false);
      this.fitViewOptionsSubject.next(undefined);
    }

    this.nodesSubject.next(nodes);
    this.nodeLookupSubject.next(nodeLookup);
  }

  setEdges(edges: EdgeType[]): void {
    const { connectionLookup, edgeLookup } = this.getCurrentState();

    updateConnectionLookup(connectionLookup, edgeLookup, edges);

    this.edgesSubject.next(edges);
    this.edgeLookupSubject.next(edgeLookup);
    this.connectionLookupSubject.next(connectionLookup);
  }

  setViewport(viewport: Viewport): void {
    this.viewportSubject.next(viewport);
  }

  setNodeTypes(nodeTypes: AngularNodeTypes): void {
    this.nodeTypesSubject.next(nodeTypes);
  }

  setEdgeTypes(edgeTypes: AngularEdgeTypes): void {
    this.edgeTypesSubject.next(edgeTypes);
  }

  setDimensions(width: number, height: number): void {
    this.dimensionsSubject.next({ width, height });
  }

  setPanZoom(panZoom: PanZoomInstance): void {
    this.panZoomSubject.next(panZoom);
  }

  setTransform(transform: Transform): void {
    this.transformSubject.next(transform);
  }

  // Node and edge operations
  updateNodeInternals(updates: Map<string, InternalNodeUpdate>): void {
    const { triggerNodeChanges, nodeLookup, parentLookup, domNode, nodeOrigin, nodeExtent, debug, fitViewQueued } = this.getCurrentState();

    const { changes, updatedInternals } = updateNodeInternalsSystem(
      updates,
      nodeLookup,
      parentLookup as any,
      domNode,
      nodeOrigin,
      nodeExtent
    );

    if (!updatedInternals) {
      return;
    }

    updateAbsolutePositions(nodeLookup, parentLookup as any, { nodeOrigin, nodeExtent });

    if (fitViewQueued) {
      this.resolveFitView();
      this.fitViewQueuedSubject.next(false);
      this.fitViewOptionsSubject.next(undefined);
    }

    if (changes?.length > 0) {
      if (debug) {
        console.log('Angular Flow: trigger node changes', changes);
      }
      this.triggerNodeChanges(changes);
    }
  }

  updateNodePositions(nodeDragItems: Map<string, NodeDragItem>, dragging = false): void {
    const parentExpandChildren: ParentExpandChild[] = [];
    const changes: NodeChange[] = [];
    const { nodeLookup } = this.getCurrentState();

    for (const [id, dragItem] of nodeDragItems) {
      const node = nodeLookup.get(id);
      const expandParent = !!(node?.expandParent && node?.parentId && dragItem?.position);

      const change: NodeChange = {
        id,
        type: 'position',
        position: expandParent
          ? {
              x: Math.max(0, dragItem.position.x),
              y: Math.max(0, dragItem.position.y),
            }
          : dragItem.position,
        dragging,
      };

      if (expandParent && node.parentId) {
        parentExpandChildren.push({
          id,
          parentId: node.parentId,
          rect: {
            ...dragItem.internals.positionAbsolute,
            width: dragItem.measured.width ?? 0,
            height: dragItem.measured.height ?? 0,
          },
        });
      }

      changes.push(change);
    }

    if (parentExpandChildren.length > 0) {
      const { parentLookup, nodeOrigin } = this.getCurrentState();
      const parentExpandChanges = handleExpandParent(parentExpandChildren, nodeLookup, parentLookup as any, nodeOrigin);
      changes.push(...parentExpandChanges);
    }

    this.triggerNodeChanges(changes);
  }

  triggerNodeChanges(changes: NodeChange[]): void {
    if (changes?.length) {
      const updatedNodes = applyNodeChanges(changes, this.nodes);
      this.setNodes(updatedNodes);
    }
  }

  triggerEdgeChanges(changes: EdgeChange[]): void {
    if (changes?.length) {
      const updatedEdges = applyEdgeChanges(changes, this.edges);
      this.setEdges(updatedEdges);
    }
  }

  // Selection operations
  addSelectedNodes(selectedNodeIds: string[]): void {
    const { multiSelectionActive, edgeLookup, nodeLookup } = this.getCurrentState();

    if (multiSelectionActive) {
      const nodeChanges = selectedNodeIds.map((nodeId) => createSelectionChange(nodeId, true));
      this.triggerNodeChanges(nodeChanges);
      return;
    }

    this.triggerNodeChanges(getSelectionChanges(nodeLookup, new Set([...selectedNodeIds])));
    this.triggerEdgeChanges(getSelectionChanges(edgeLookup));
  }

  addSelectedEdges(selectedEdgeIds: string[]): void {
    const { multiSelectionActive, edgeLookup, nodeLookup } = this.getCurrentState();

    if (multiSelectionActive) {
      const changedEdges = selectedEdgeIds.map((edgeId) => createSelectionChange(edgeId, true));
      this.triggerEdgeChanges(changedEdges);
      return;
    }

    this.triggerEdgeChanges(getSelectionChanges(edgeLookup, new Set([...selectedEdgeIds])));
    this.triggerNodeChanges(getSelectionChanges(nodeLookup, new Set()));
  }

  unselectNodesAndEdges({ nodes, edges }: UnselectNodesAndEdgesParams = {}): void {
    const { edges: storeEdges, nodes: storeNodes, nodeLookup } = this.getCurrentState();
    const nodesToUnselect = nodes ? nodes : storeNodes;
    const edgesToUnselect = edges ? edges : storeEdges;

    const nodeChanges = nodesToUnselect.map((n: AngularFlowNode) => {
      const internalNode = nodeLookup.get(n.id);
      if (internalNode) {
        internalNode.selected = false;
      }
      return createSelectionChange(n.id, false);
    });

    const edgeChanges = edgesToUnselect.map((edge: AngularFlowEdge) => createSelectionChange(edge.id, false));

    this.triggerNodeChanges(nodeChanges);
    this.triggerEdgeChanges(edgeChanges);
  }

  // Viewport operations
  async panBy(delta: XYPosition): Promise<boolean> {
    const { transform, width, height, panZoom, translateExtent } = this.getCurrentState();
    return panBySystem({ delta, panZoom, transform, translateExtent, width, height });
  }

  async setCenter(x: number, y: number, options?: SetCenterOptions): Promise<boolean> {
    const { width, height, maxZoom, panZoom } = this.getCurrentState();

    if (!panZoom) {
      return Promise.resolve(false);
    }

    const nextZoom = typeof options?.zoom !== 'undefined' ? options.zoom : maxZoom;

    await panZoom.setViewport(
      {
        x: width / 2 - x * nextZoom,
        y: height / 2 - y * nextZoom,
        zoom: nextZoom,
      },
      { duration: options?.duration, ease: options?.ease, interpolate: options?.interpolate }
    );

    return Promise.resolve(true);
  }

  async fitView(options?: FitViewOptionsBase): Promise<boolean> {
    const fitViewResolver = this.fitViewResolverSubject.value ?? { resolve: () => {} };

    this.fitViewQueuedSubject.next(true);
    this.fitViewOptionsSubject.next(options);
    this.fitViewResolverSubject.next(fitViewResolver);

    // Trigger nodes update to resolve fitView
    this.setNodes([...this.nodes]);

    return new Promise((resolve) => {
      fitViewResolver.resolve = resolve;
    });
  }

  private async resolveFitView(): Promise<void> {
    const { nodeLookup, panZoom, fitViewOptions, fitViewResolver, width, height, minZoom, maxZoom } = this.getCurrentState();

    if (!panZoom) {
      return;
    }

    await fitViewport(
      {
        nodes: nodeLookup,
        width,
        height,
        panZoom,
        minZoom,
        maxZoom,
      },
      fitViewOptions
    );

    fitViewResolver?.resolve(true);
    this.fitViewResolverSubject.next(null);
  }

  // Connection operations
  updateConnection(connection: ConnectionState): void {
    this.connectionSubject.next(connection);
  }

  cancelConnection(): void {
    this.connectionSubject.next(initialConnection);
  }

  // Configuration setters
  setMinZoom(minZoom: number): void {
    const panZoom = this.panZoom;
    panZoom?.setScaleExtent([minZoom, this.maxZoom]);
    this.minZoomSubject.next(minZoom);
  }

  setMaxZoom(maxZoom: number): void {
    const panZoom = this.panZoom;
    panZoom?.setScaleExtent([this.minZoom, maxZoom]);
    this.maxZoomSubject.next(maxZoom);
  }

  setTranslateExtent(translateExtent: CoordinateExtent): void {
    const panZoom = this.panZoom;
    panZoom?.setTranslateExtent(translateExtent);
    this.translateExtentSubject.next(translateExtent);
  }

  setNodeExtent(nodeExtent: CoordinateExtent): void {
    this.nodeExtentSubject.next(nodeExtent);
  }

  setNodeOrigin(nodeOrigin: NodeOrigin): void {
    this.nodeOriginSubject.next(nodeOrigin);
  }

  setElementsSelectable(selectable: boolean): void {
    this.elementsSelectableSubject.next(selectable);
  }

  setNodesDraggable(draggable: boolean): void {
    this.nodesDraggableSubject.next(draggable);
  }

  setNodesConnectable(connectable: boolean): void {
    this.nodesConnectableSubject.next(connectable);
  }

  // Event handler setters
  setOnError(onError: OnError | null): void {
    this.onErrorSubject.next(onError);
  }

  setIsValidConnection(isValidConnection: IsValidConnection | null): void {
    this.isValidConnectionSubject.next(isValidConnection);
  }

  setOnConnect(onConnect: OnConnect | null): void {
    this.onConnectSubject.next(onConnect);
  }

  setOnConnectStart(onConnectStart: OnConnectStart | null): void {
    this.onConnectStartSubject.next(onConnectStart);
  }

  setOnConnectEnd(onConnectEnd: OnConnectEnd | null): void {
    this.onConnectEndSubject.next(onConnectEnd);
  }

  setOnBeforeConnect(onBeforeConnect: OnReconnect | null): void {
    this.onBeforeConnectSubject.next(onBeforeConnect);
  }

  // Event handler getters (needed by components) - simplified
  get onNodeClick(): any { return null; }
  get onNodeDoubleClick(): any { return null; }
  get onNodeContextMenu(): any { return null; }
  get onNodeMouseEnter(): any { return null; }
  get onNodeMouseLeave(): any { return null; }
  get onNodeDragStart(): any { return null; }
  get onNodeDrag(): any { return null; }
  get onNodeDragStop(): any { return null; }

  get onEdgeClick(): any { return null; }
  get onEdgeDoubleClick(): any { return null; }
  get onEdgeContextMenu(): any { return null; }
  get onEdgeMouseEnter(): any { return null; }
  get onEdgeMouseLeave(): any { return null; }

  get onConnect(): OnConnect | null { return this.onConnectSubject.value; }
  get onConnectStart(): OnConnectStart | null { return this.onConnectStartSubject.value; }
  get onConnectEnd(): OnConnectEnd | null { return this.onConnectEndSubject.value; }
  get onBeforeConnect(): OnReconnect | null { return this.onBeforeConnectSubject.value; }
  get isValidConnection(): IsValidConnection | null { return this.isValidConnectionSubject.value; }

  // Connection state getters
  get connectionMode(): any { return 'Strict'; }
  get autoPanOnConnect(): boolean { return false; }
  get connectionRadius(): number { return 20; }
  get autoPanSpeed(): number { return 15; }
  get connectionDragThreshold(): number { return 1; }
  get onClickConnectStart(): any { return null; }
  get onClickConnectEnd(): any { return null; }
  get connectionClickStartHandle(): any { return null; }
  get domNode(): HTMLElement | null { return null; }

  // Method to add edge directly
  addEdge(edge: AngularFlowEdge): void {
    const edges = [...this.edges, edge];
    this.setEdges(edges as any);
  }

  // Public helper methods needed by components
  applyNodeChanges(changes: NodeChange[]): void {
    const updatedNodes = applyNodeChanges(changes, this.nodes);
    this.setNodes(updatedNodes);
  }

  applyEdgeChanges(changes: EdgeChange[]): void {
    const updatedEdges = applyEdgeChanges(changes, this.edges);
    this.setEdges(updatedEdges);
  }

  zoomIn(): void {
    this.panZoom?.scaleBy(1.2);
  }

  zoomOut(): void {
    this.panZoom?.scaleBy(1 / 1.2);
  }

  getPanZoom(): PanZoomInstance | null {
    return this.panZoom;
  }

  getDimensions(): { width: number; height: number } {
    return {
      width: this.width,
      height: this.height
    };
  }

  getTranslateExtent(): CoordinateExtent {
    return this.translateExtent;
  }

  startSelectionArea(position: XYPosition): void {
    // Implementation for selection area start - simplified for now
    console.log('Selection area started at:', position);
  }

  endSelectionArea(): void {
    // Implementation for selection area end - simplified for now
    console.log('Selection area ended');
  }

  // Connection line methods
  /**
   * Start a connection from a handle
   */
  startConnection(handle: { nodeId: string; handleId?: string; type: 'source' | 'target'; position: { x: number; y: number } }): void {
    this.connectionStartHandleSubject.next(handle);
    this.connectionInProgressSubject.next(true);

    // Set up global mouse move listener
    this.setupConnectionMovement();
  }

  /**
   * Update the connection position (usually called on mouse move)
   */
  updateConnectionPosition(position: { x: number; y: number }): void {
    this.connectionPositionSubject.next(position);
  }

  /**
   * End the connection process
   */
  endConnection(): void {
    this.connectionStartHandleSubject.next(null);
    this.connectionPositionSubject.next(null);
    this.connectionInProgressSubject.next(false);

    // Clean up global listeners
    this.cleanupConnectionMovement();
  }

  // Selection methods
  /**
   * Set selected nodes
   */
  setSelectedNodes(nodeIds: string[]): void {
    this.selectedNodesSubject.next([...nodeIds]);
  }

  /**
   * Set selected edges
   */
  setSelectedEdges(edgeIds: string[]): void {
    this.selectedEdgesSubject.next([...edgeIds]);
  }

  /**
   * Add nodes to current selection
   */
  addToSelection(nodeIds: string[] = [], edgeIds: string[] = []): void {
    const currentNodes = this.selectedNodesSubject.value;
    const currentEdges = this.selectedEdgesSubject.value;

    this.selectedNodesSubject.next([...new Set([...currentNodes, ...nodeIds])]);
    this.selectedEdgesSubject.next([...new Set([...currentEdges, ...edgeIds])]);
  }

  /**
   * Clear all selections
   */
  clearSelection(): void {
    this.selectedNodesSubject.next([]);
    this.selectedEdgesSubject.next([]);
  }

  /**
   * Select nodes in a rectangular area
   */
  selectNodesInArea(rect: { x: number; y: number; width: number; height: number }): void {
    const nodes = this.nodes;
    const selectedNodeIds: string[] = [];

    nodes.forEach((node: NodeType) => {
      const nodeX = node.position?.x || 0;
      const nodeY = node.position?.y || 0;
      const nodeWidth = node.width || 150;
      const nodeHeight = node.height || 40;

      // Check if node intersects with selection rectangle
      if (
        nodeX < rect.x + rect.width &&
        nodeX + nodeWidth > rect.x &&
        nodeY < rect.y + rect.height &&
        nodeY + nodeHeight > rect.y
      ) {
        selectedNodeIds.push(node.id);
      }
    });

    this.setSelectedNodes(selectedNodeIds);
  }

  // Private helper methods for connection tracking
  private connectionMoveHandler?: (event: MouseEvent) => void;
  private connectionUpHandler?: (event: MouseEvent) => void;

  private setupConnectionMovement(): void {
    this.connectionMoveHandler = (event: MouseEvent) => {
      this.updateConnectionPosition({ x: event.clientX, y: event.clientY });
    };

    this.connectionUpHandler = (event: MouseEvent) => {
      this.endConnection();
    };

    document.addEventListener('mousemove', this.connectionMoveHandler);
    document.addEventListener('mouseup', this.connectionUpHandler);
  }

  private cleanupConnectionMovement(): void {
    if (this.connectionMoveHandler) {
      document.removeEventListener('mousemove', this.connectionMoveHandler);
      this.connectionMoveHandler = undefined;
    }

    if (this.connectionUpHandler) {
      document.removeEventListener('mouseup', this.connectionUpHandler);
      this.connectionUpHandler = undefined;
    }
  }

  // Reset
  reset(): void {
    this.initializeState();
  }

  // Helper method to get current state snapshot (for compatibility with system methods)
  private getCurrentState() {
    return {
      nodes: this.nodes,
      edges: this.edges,
      nodeLookup: this.nodeLookup,
      edgeLookup: this.edgeLookup,
      connectionLookup: this.connectionLookup,
      parentLookup: this.parentLookup,
      panZoom: this.panZoom,
      transform: this.transform,
      viewport: this.viewport,
      nodeOrigin: this.nodeOrigin,
      nodeExtent: this.nodeExtent,
      minZoom: this.minZoom,
      maxZoom: this.maxZoom,
      translateExtent: this.translateExtent,
      elementsSelectable: this.elementsSelectable,
      nodesDraggable: this.nodesDraggable,
      nodesConnectable: this.nodesConnectable,
      width: this.width,
      height: this.height,
      connection: this.connection,
      fitViewQueued: this.fitViewQueuedSubject.value,
      fitViewOptions: this.fitViewOptionsSubject.value,
      fitViewResolver: this.fitViewResolverSubject.value,
      triggerNodeChanges: this.triggerNodeChanges.bind(this),
      triggerEdgeChanges: this.triggerEdgeChanges.bind(this),
      onError: this.onErrorSubject.value,
      isValidConnection: this.isValidConnectionSubject.value,
      onConnect: this.onConnectSubject.value,
      onConnectStart: this.onConnectStartSubject.value,
      onConnectEnd: this.onConnectEndSubject.value,
      onBeforeConnect: this.onBeforeConnectSubject.value,
      multiSelectionActive: false, // TODO: Implement multi-selection state
      elevateNodesOnSelect: false, // TODO: Implement from config
      debug: false, // TODO: Implement from config
      domNode: null, // TODO: Set from component
    };
  }
}

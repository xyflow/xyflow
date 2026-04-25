import Component from '@glimmer/component';
import type Owner from '@ember/owner';
import { htmlSafe } from '@ember/template';
import {
  ConnectionLineType,
  ConnectionMode,
  SelectionMode,
  infiniteExtent,
  PanOnScrollMode,
  Position,
  XYPanZoom,
  calcAutoPan,
  getBezierPath,
  getConnectionStatus,
  getSmoothStepPath,
  getEdgeId,
  getStraightPath,
  isInputDOMNode,
  isEdgeVisible,
  pointToRendererPoint,
  type Transform,
  type Viewport,
} from '@xyflow/system';

import listen from '../modifiers/listen.js';
import flowStore from '../modifiers/flow-store.js';
import panZoom from '../modifiers/pan-zoom.js';
import EmberFlowStore from '../store/index.js';
import { getEdgePathData, getSimpleBezierPath } from '../utils/edge-path.js';
import { getViewportOverlayTransform } from '../utils/viewport-overlay.js';
import { safeStyle, toCss } from '../utils/style.js';
import FlowEdge from './flow-edge.js';
import FlowNode from './flow-node.js';
import type { Connection, Edge, EdgeChange, EmberFlowArgs, Node, NodeChange, NodeComponent } from '../types.js';

type HandleType = 'source' | 'target';

const oppositePosition = {
  [Position.Left]: Position.Right,
  [Position.Right]: Position.Left,
  [Position.Top]: Position.Bottom,
  [Position.Bottom]: Position.Top,
};

const arrowKeyDiffs: Record<string, { x: number; y: number }> = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
};

interface EdgeRenderItem<EdgeType extends Edge = Edge, NodeType extends Node = Node> {
  edge: EdgeType;
  source: NodeType;
  target: NodeType;
}

interface NodeResizeDetail {
  id: string;
  position: { x: number; y: number };
  dimensions: { width: number; height: number };
  direction: number[];
  resizing: boolean;
}

interface Signature<NodeType extends Node = Node, EdgeType extends Edge = Edge> {
  Args: EmberFlowArgs<NodeType, EdgeType>;
  Blocks: {
    default: [EmberFlowStore<NodeType, EdgeType>];
  };
  Element: HTMLDivElement;
}

export default class EmberFlow<
  NodeType extends Node = Node,
  EdgeType extends Edge = Edge,
> extends Component<Signature<NodeType, EdgeType>> {
  private store: EmberFlowStore<NodeType, EdgeType>;
  private rendererElement: HTMLDivElement | null = null;
  private viewportElement: HTMLDivElement | null = null;
  private selectionElement: HTMLDivElement | null = null;
  private connectionLineElement: SVGSVGElement | null = null;
  private connectionPathElement: SVGPathElement | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private viewportDimensionsFrame: number | null = null;
  private didFitView = false;
  private didSetInitialInteractivity = false;
  private suppressPaneClick = false;
  private suppressNodeClick = false;
  private suppressNodeClickFrame: number | null = null;
  private unsubscribeViewportTransform: (() => void) | null = null;
  // Hot pointer interactions should stay off Ember's tracked render path while the
  // cursor is moving. Live movement mutates DOM/system mirrors directly; pointer-up
  // commits the public Ember model changes and bumps tracked state once.
  private pendingSelectionFrame: number | null = null;
  private pendingConnectionFrame: number | null = null;
  private pendingConnectionAutoPanFrame: number | null = null;
  private pendingNodeAutoPanFrame: number | null = null;
  private connectionTargetHandleElement: HTMLElement | null = null;
  private activeNodeDrag: {
    id: string;
    pointerId: number;
    startClientX: number;
    startClientY: number;
    currentClientX: number;
    currentClientY: number;
    currentEvent: PointerEvent | null;
    pointerOffsetX: number;
    pointerOffsetY: number;
    startPrimaryPosition: { x: number; y: number };
    startPositions: Map<string, { x: number; y: number }>;
    didMove: boolean;
    started: boolean;
  } | null = null;
  private activeSelection: {
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
  } | null = null;
  private activeConnection: {
    nodeId: string;
    handleId: string | null;
    handleType: HandleType;
    pointerId: number;
    currentEvent: PointerEvent | null;
    fromElement: Element | null;
    fromPosition: Position;
    fromX: number;
    fromY: number;
    toPosition: Position;
    toX: number;
    toY: number;
    targetHandle: HTMLElement | null;
    reconnect?: {
      edge: EdgeType;
      handleType: HandleType;
    };
  } | null = null;
  private keydownHandler: ((event: KeyboardEvent) => void) | null = null;
  private keyupHandler: ((event: KeyboardEvent) => void) | null = null;

  constructor(owner: Owner, args: Signature<NodeType, EdgeType>['Args']) {
    super(owner, args);
    this.store = new EmberFlowStore<NodeType, EdgeType>(args.initialViewport);
    this.configureStorePlacement();
  }

  get nodes() {
    return this.store.getNodes(this.args.nodes ?? []);
  }

  get edges() {
    return this.store.getEdges(this.args.edges ?? []).map((edge) => this.applyDefaultEdgeOptions(edge));
  }

  get minZoom() {
    return this.args.minZoom ?? 0.5;
  }

  get maxZoom() {
    return this.args.maxZoom ?? 2;
  }

  get nodesDraggable() {
    return this.store.nodesDraggable;
  }

  get elementsSelectable() {
    return this.store.elementsSelectable;
  }

  get nodesConnectable() {
    return this.store.nodesConnectable;
  }

  get deleteKey() {
    return this.args.deleteKey ?? 'Backspace';
  }

  get edgesReconnectable() {
    return this.args.edgesReconnectable ?? Boolean(this.args.onReconnect);
  }

  get reconnectRadius() {
    return this.args.reconnectRadius ?? 10;
  }

  get connectionMode() {
    return this.args.connectionMode ?? ConnectionMode.Strict;
  }

  get connectionRadius() {
    return this.args.connectionRadius ?? 20;
  }

  get selectionMode() {
    return this.args.selectionMode ?? SelectionMode.Full;
  }

  get defaultEdgeOptions() {
    return this.args.defaultEdgeOptions ?? {};
  }

  get rootClasses() {
    let classes = ['ember-flow', 'ember-flow__container'];

    if (this.args.colorMode === 'dark') {
      classes.push('dark');
    }

    return classes.join(' ');
  }

  get rootStyle() {
    let declarations: string[] = [];

    if (this.args.width !== undefined) {
      declarations.push(`width: ${this.toCssSize(this.args.width)}`);
    }

    if (this.args.height !== undefined) {
      declarations.push(`height: ${this.toCssSize(this.args.height)}`);
    }

    return declarations.length > 0 ? htmlSafe(declarations.join('; ')) : undefined;
  }

  get viewportStyle() {
    return htmlSafe(this.getViewportTransform(this.store.viewport));
  }

  get connectionLineInitialStyle() {
    return htmlSafe(`display: none; ${toCss(this.args.connectionLineContainerStyle)}`);
  }

  get connectionLinePathStyle() {
    return safeStyle(this.args.connectionLineStyle);
  }

  get edgeItems(): EdgeRenderItem<EdgeType, NodeType>[] {
    let nodesById = new Map(this.nodes.map((node) => [node.id, node]));

    return this.edges
      .map((edge) => {
        let source = nodesById.get(edge.source);
        let target = nodesById.get(edge.target);

        if (!source || !target || edge.hidden || !this.shouldRenderEdge(edge)) {
          return null;
        }

        return { edge, source, target };
      })
      .filter((item): item is EdgeRenderItem<EdgeType, NodeType> => item !== null);
  }

  get renderedNodes() {
    let nodes = this.nodes;

    if (!this.args.onlyRenderVisibleElements || this.store.width === 0 || this.store.height === 0) {
      return nodes;
    }

    return nodes.filter((node) => this.isRenderedNodeVisible(node));
  }

  private isRenderedNodeVisible(node: NodeType) {
    if (node.hidden) {
      return false;
    }

    let bounds = this.store.getRenderedNodeBounds(node);
    let viewport = this.store.viewport;
    let viewRect = {
      x: -viewport.x / viewport.zoom,
      y: -viewport.y / viewport.zoom,
      width: this.store.width / viewport.zoom,
      height: this.store.height / viewport.zoom,
    };

    return (
      bounds.x <= viewRect.x + viewRect.width &&
      bounds.x + bounds.width >= viewRect.x &&
      bounds.y <= viewRect.y + viewRect.height &&
      bounds.y + bounds.height >= viewRect.y
    );
  }

  private shouldRenderEdge(edge: EdgeType) {
    if (!this.args.onlyRenderVisibleElements || this.store.width === 0 || this.store.height === 0) {
      return true;
    }

    let sourceNode = this.store.nodeLookup.get(edge.source);
    let targetNode = this.store.nodeLookup.get(edge.target);

    return Boolean(
      sourceNode &&
        targetNode &&
        isEdgeVisible({
          sourceNode,
          targetNode,
          width: this.store.width,
          height: this.store.height,
          transform: [this.store.viewport.x, this.store.viewport.y, this.store.viewport.zoom],
        }),
    );
  }

  private applyDefaultEdgeOptions(edge: EdgeType): EdgeType {
    return {
      ...this.defaultEdgeOptions,
      ...edge,
    } as EdgeType;
  }

  installPanZoom(element: HTMLDivElement) {
    this.rendererElement = element;
    this.viewportElement = element.querySelector<HTMLDivElement>('.ember-flow__viewport');
    this.selectionElement = element.querySelector<HTMLDivElement>('.ember-flow__selection');
    this.connectionLineElement = element.querySelector<SVGSVGElement>('.ember-flow__connectionline');
    this.connectionPathElement = element.querySelector<SVGPathElement>('.ember-flow__connection-path');
    this.resizeObserver?.disconnect();
    this.resizeObserver = new ResizeObserver(() => {
      this.scheduleViewportDimensionsUpdate();
    });
    this.resizeObserver.observe(element);
    this.store.domNode = element;
    this.store.setZoomExtent(this.minZoom, this.maxZoom);
    this.configureStorePlacement();
    if (!this.didSetInitialInteractivity) {
      this.didSetInitialInteractivity = true;
      this.store.setInteractivity({
        nodesDraggable: this.args.nodesDraggable ?? true,
        nodesConnectable: this.args.nodesConnectable ?? true,
        elementsSelectable: this.args.elementsSelectable ?? true,
      });
    }
    this.unsubscribeViewportTransform?.();
    this.unsubscribeViewportTransform = this.store.onViewportChange((viewport) => {
      this.applyViewportTransform(viewport);
    });
    this.keydownHandler = this.handleKeyDown;
    this.keyupHandler = this.handleKeyUp;
    window.addEventListener('keydown', this.keydownHandler);
    window.addEventListener('keyup', this.keyupHandler);

    this.store.panZoom = XYPanZoom({
      domNode: element,
      minZoom: this.minZoom,
      maxZoom: this.maxZoom,
      translateExtent: this.store.translateExtent,
      viewport: this.store.viewport,
      onPanZoomStart: this.args.onMoveStart,
      onPanZoom: this.args.onMove,
      onPanZoomEnd: this.args.onMoveEnd,
      onDraggingChange: () => {},
    });

    let currentViewport = this.store.panZoom.getViewport();
    if (
      currentViewport.x !== this.store.viewport.x ||
      currentViewport.y !== this.store.viewport.y ||
      currentViewport.zoom !== this.store.viewport.zoom
    ) {
      this.handleTransformChange([currentViewport.x, currentViewport.y, currentViewport.zoom]);
    }

    this.store.panZoom.update({
      noWheelClassName: 'nowheel',
      noPanClassName: 'nopan',
      onPaneContextMenu: undefined,
      userSelectionActive: false,
      panOnScroll: this.args.panOnScroll ?? false,
      panOnDrag: this.args.panOnDrag ?? true,
      panOnScrollMode: this.args.panOnScrollMode ?? PanOnScrollMode.Free,
      panOnScrollSpeed: this.args.panOnScrollSpeed ?? 0.5,
      preventScrolling: this.args.preventScrolling ?? true,
      zoomOnPinch: this.args.zoomOnPinch ?? true,
      zoomOnScroll: this.args.zoomOnScroll ?? true,
      zoomOnDoubleClick: this.args.zoomOnDoubleClick ?? true,
      zoomActivationKeyPressed: false,
      lib: 'ember',
      onTransformChange: this.handleTransformChange,
      connectionInProgress: false,
      paneClickDistance: 1,
      selectionOnDrag: this.args.selectionOnDrag ?? false,
    });

    this.scheduleViewportDimensionsUpdate();

    if (this.args.fitView && !this.didFitView) {
      this.didFitView = true;
      requestAnimationFrame(() => {
        this.measureRenderedNodes();
        this.store.setViewportDimensions(element.clientWidth, element.clientHeight);
        void this.store.fitView(this.args.fitViewOptions);
      });
    }
  }

  uninstallPanZoom() {
    if (this.viewportDimensionsFrame !== null) {
      cancelAnimationFrame(this.viewportDimensionsFrame);
      this.viewportDimensionsFrame = null;
    }
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    this.store.panZoom?.destroy();
    this.store.panZoom = null;
    this.rendererElement = null;
    this.viewportElement = null;
    this.selectionElement = null;
    this.connectionLineElement = null;
    this.connectionPathElement = null;
    this.store.domNode = null;
    this.unsubscribeViewportTransform?.();
    this.unsubscribeViewportTransform = null;
    if (this.keydownHandler) {
      window.removeEventListener('keydown', this.keydownHandler);
      this.keydownHandler = null;
    }
    if (this.keyupHandler) {
      window.removeEventListener('keyup', this.keyupHandler);
      this.keyupHandler = null;
    }
    this.detachNodeDragListeners();
    this.detachSelectionListeners();
    this.detachConnectionListeners();
  }

  private handleTransformChange = (transform: Transform) => {
    this.store.setViewportFromPanZoom({ x: transform[0], y: transform[1], zoom: transform[2] });
    if (this.args.onlyRenderVisibleElements) {
      this.store.bump();
    }
  };

  private updateViewportDimensions() {
    let element = this.rendererElement;

    if (!element) {
      return;
    }

    this.store.setViewportDimensions(element.clientWidth, element.clientHeight);
  }

  private scheduleViewportDimensionsUpdate(attempt = 0) {
    if (this.viewportDimensionsFrame !== null) {
      cancelAnimationFrame(this.viewportDimensionsFrame);
    }

    this.viewportDimensionsFrame = requestAnimationFrame(() => {
      this.viewportDimensionsFrame = null;
      this.updateViewportDimensions();
      this.measureRenderedNodes();

      if ((this.store.width === 0 || this.store.height === 0) && attempt < 10) {
        this.scheduleViewportDimensionsUpdate(attempt + 1);
      }
    });
  }

  private configureStorePlacement() {
    this.store.setNodeOrigin(this.args.nodeOrigin ?? [0, 0]);
    this.store.setNodeExtent(this.args.nodeExtent ?? infiniteExtent);
    this.store.setTranslateExtent(this.args.translateExtent ?? infiniteExtent);
    this.store.setSnapGrid(this.args.snapToGrid ?? false, this.args.snapGrid ?? [15, 15]);
    this.store.setAutoPanOptions({
      autoPanOnNodeDrag: this.args.autoPanOnNodeDrag,
      autoPanOnConnect: this.args.autoPanOnConnect,
      autoPanSpeed: this.args.autoPanSpeed,
    });
  }

  private toCssSize(value: number | string) {
    return typeof value === 'number' ? `${value}px` : value;
  }

  private applyViewportTransform(viewport: Viewport) {
    if (this.viewportElement) {
      this.viewportElement.style.transform = this.getViewportTransform(viewport);
    }
    this.rendererElement?.style.setProperty(
      '--ember-flow-resize-control-scale',
      `${Math.max(1 / viewport.zoom, 1)}`,
    );
  }

  private measureRenderedNodes() {
    let changed = false;

    for (let node of this.nodes) {
      let element = this.nodeElement(node.id);
      if (!element) {
        continue;
      }

      let width = element.offsetWidth;
      let height = element.offsetHeight;

      if (width <= 0 || height <= 0) {
        continue;
      }

      let currentWidth = this.store.getNodeWidth(node);
      let currentHeight = this.store.getNodeHeight(node);

      if (Math.abs(currentWidth - width) > 0.5 || Math.abs(currentHeight - height) > 0.5) {
        this.store.setNodeDimensions(node.id, { width, height });
        changed = true;
      }
    }

    if (changed) {
      this.store.bump();
    }
  }

  private getViewportTransform(viewport: Viewport) {
    return `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`;
  }

  handleNodeClick = (node: Node, event: MouseEvent) => {
    if (this.suppressNodeClick) {
      this.suppressNodeClick = false;
      this.flushSuppressNodeClickFrame();
      return;
    }

    this.args.onNodeClick?.(event, node as NodeType);

    if (!this.elementsSelectable || node.selectable === false || this.activeNodeDrag?.didMove) {
      return;
    }

    if (!event.shiftKey && !this.store.isMultiSelectionActive(this.args.multiSelectionKey)) {
      this.clearSelection();
    }

    this.selectNode(node.id);
  };

  handleEdgeClick = (edge: Edge, event: MouseEvent) => {
    this.args.onEdgeClick?.(event, edge as EdgeType);

    if (!this.elementsSelectable || edge.selectable === false) {
      return;
    }

    event.stopPropagation();

    if (!event.shiftKey && !this.store.isMultiSelectionActive(this.args.multiSelectionKey)) {
      this.clearSelection();
    }

    this.selectEdge(edge.id);
  };

  handleRendererClick = (event: MouseEvent) => {
    if (this.suppressPaneClick) {
      this.suppressPaneClick = false;
      return;
    }

    let target = event.target as Element | null;
    let edgeElement = target?.closest<SVGGElement>('.ember-flow__edge');

    if (edgeElement && this.rendererElement?.contains(edgeElement)) {
      let edgeId = edgeElement.dataset['id'];
      let edge = this.edges.find((candidate) => candidate.id === edgeId);

      if (edge) {
        this.handleEdgeClick(edge, event);
        return;
      }
    }

    if (
      target?.closest(
        '.ember-flow__node, .ember-flow__edge, .ember-flow__edge-label, .ember-flow__panel, .ember-flow__controls',
      )
    ) {
      return;
    }

    this.clearSelection();
    this.args.onPaneClick?.(event);
  };

  handleNodePointerDown = (node: Node, event: PointerEvent) => {
    if (!this.nodesDraggable || node.draggable === false || event.button !== 0) {
      return;
    }

    let target = event.target as Element | null;
    let handle = target?.closest<HTMLElement>('.ember-flow__handle');
    if (handle) {
      let handleType = this.getHandleType(handle);
      if (handleType) {
        this.handleHandlePointerDown(node, handleType, event, handle);
      }
      return;
    }

    if (target?.closest('.nodrag')) {
      return;
    }

    if (node.dragHandle && !target?.closest(node.dragHandle)) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    let nodePosition = this.store.getNodePosition(node);
    let pointerPosition = this.clientToFlowPosition(event.clientX, event.clientY);

    if (!pointerPosition) {
      return;
    }

    let startPositions = this.getNodeDragStartPositions(node);

    this.activeNodeDrag = {
      id: node.id,
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startClientY: event.clientY,
      currentClientX: event.clientX,
      currentClientY: event.clientY,
      currentEvent: null,
      pointerOffsetX: pointerPosition.x - nodePosition.x,
      pointerOffsetY: pointerPosition.y - nodePosition.y,
      startPrimaryPosition: nodePosition,
      startPositions,
      didMove: false,
      started: false,
    };

    for (let id of startPositions.keys()) {
      this.nodeElement(id)?.classList.add('dragging');
    }
    window.addEventListener('pointermove', this.handleWindowNodePointerMove);
    window.addEventListener('pointerup', this.handleWindowNodePointerUp);
    window.addEventListener('pointercancel', this.handleWindowNodePointerUp);
  };

  private getNodeDragStartPositions(primaryNode: Node) {
    let shouldDragSelection = primaryNode.selected || this.store.selectedNodeIds.has(primaryNode.id);
    let nodes = shouldDragSelection
      ? this.nodes.filter((node) => (node.selected || this.store.selectedNodeIds.has(node.id)) && node.draggable !== false)
      : [primaryNode];
    let startPositions = new Map<string, { x: number; y: number }>();

    if (!nodes.some((node) => node.id === primaryNode.id)) {
      nodes = [primaryNode, ...nodes];
    }

    for (let node of nodes) {
      startPositions.set(node.id, this.store.getNodePosition(node));
    }

    return startPositions;
  }

  handlePanePointerDown = (event: PointerEvent) => {
    if (!this.shouldStartSelection(event)) {
      return;
    }

    let renderer = this.rendererElement;
    if (!renderer) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    let rect = renderer.getBoundingClientRect();
    this.activeSelection = {
      startX: event.clientX - rect.left,
      startY: event.clientY - rect.top,
      currentX: event.clientX - rect.left,
      currentY: event.clientY - rect.top,
    };
    this.renderSelectionRect();
    window.addEventListener('pointermove', this.handleWindowSelectionPointerMove);
    window.addEventListener('pointerup', this.handleWindowSelectionPointerUp);
    window.addEventListener('pointercancel', this.handleWindowSelectionPointerUp);
  };

  private shouldStartSelection(event: PointerEvent) {
    if (event.button !== 0 || !this.elementsSelectable) {
      return false;
    }

    let target = event.target as Element | null;
    let eventTargetIsPane = Boolean(target?.closest('.ember-flow__pane'));
    let selectionOnDrag = (this.args.selectionOnDrag ?? false) && eventTargetIsPane;

    return selectionOnDrag || this.isSelectionKeyActive(event);
  }

  handleHandlePointerDown = (
    node: Node,
    handleType: HandleType,
    event: PointerEvent,
    handleElement?: HTMLElement,
  ) => {
    if (!this.nodesConnectable || node.connectable === false || event.button !== 0) {
      return;
    }

    let renderer = this.rendererElement;
    let handle = handleElement ?? (event.currentTarget as HTMLElement | null);
    if (!renderer || !handle) {
      return;
    }

    if (!this.canStartConnection(handle)) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    let rendererRect = renderer.getBoundingClientRect();
    let handleRect = handle.getBoundingClientRect();
    let fromX = handleRect.left + handleRect.width / 2 - rendererRect.left;
    let fromY = handleRect.top + handleRect.height / 2 - rendererRect.top;
    let fromPosition = this.getHandlePosition(handle, handleType === 'source' ? Position.Bottom : Position.Top);

    this.activeConnection = {
      nodeId: node.id,
      handleId: this.getHandleId(handle),
      handleType,
      pointerId: event.pointerId,
      currentEvent: null,
      fromElement: handle,
      fromPosition,
      fromX,
      fromY,
      toPosition: oppositePosition[fromPosition],
      toX: event.clientX - rendererRect.left,
      toY: event.clientY - rendererRect.top,
      targetHandle: null,
    };

    this.args.onConnectStart?.(event, {
      nodeId: node.id,
      handleId: this.getHandleId(handle),
      handleType,
    });
    this.renderConnectionLine();
    window.addEventListener('pointermove', this.handleWindowConnectionPointerMove);
    window.addEventListener('pointerup', this.handleWindowConnectionPointerUp);
    window.addEventListener('pointercancel', this.handleWindowConnectionPointerUp);
  };

  handleEdgeReconnectPointerDown = (
    edge: Edge,
    handleType: HandleType,
    event: PointerEvent,
    fixedElement: SVGElement | null,
  ) => {
    if (!this.args.onReconnect || event.button !== 0) {
      return;
    }

    let renderer = this.rendererElement;
    let fixed = fixedElement ?? (event.currentTarget as SVGElement | null);
    if (!renderer || !fixed) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    let reconnectingSource = handleType === 'source';
    let fixedHandleType: HandleType = reconnectingSource ? 'target' : 'source';
    let fixedNodeId = reconnectingSource ? edge.target : edge.source;
    let fixedHandleId = reconnectingSource ? (edge.targetHandle ?? null) : (edge.sourceHandle ?? null);
    let rendererRect = renderer.getBoundingClientRect();
    let fixedRect = fixed.getBoundingClientRect();
    let fromX = fixedRect.left + fixedRect.width / 2 - rendererRect.left;
    let fromY = fixedRect.top + fixedRect.height / 2 - rendererRect.top;
    let fromPosition = this.getHandlePosition(fixed, fixedHandleType === 'source' ? Position.Bottom : Position.Top);

    this.activeConnection = {
      nodeId: fixedNodeId,
      handleId: fixedHandleId,
      handleType: fixedHandleType,
      pointerId: event.pointerId,
      currentEvent: null,
      fromElement: fixed,
      fromPosition,
      fromX,
      fromY,
      toPosition: oppositePosition[fromPosition],
      toX: event.clientX - rendererRect.left,
      toY: event.clientY - rendererRect.top,
      targetHandle: null,
      reconnect: {
        edge: edge as EdgeType,
        handleType,
      },
    };

    this.args.onConnectStart?.(event, {
      nodeId: fixedNodeId,
      handleId: fixedHandleId,
      handleType: fixedHandleType,
    });
    this.args.onReconnectStart?.(event, edge as EdgeType, handleType);
    this.renderConnectionLine();
    window.addEventListener('pointermove', this.handleWindowConnectionPointerMove);
    window.addEventListener('pointerup', this.handleWindowConnectionPointerUp);
    window.addEventListener('pointercancel', this.handleWindowConnectionPointerUp);
  };

  private applyActiveNodeDrag(scheduleAutoPan = true) {
    let drag = this.activeNodeDrag;
    if (!drag?.didMove) {
      return;
    }

    let pointerPosition = this.clientToFlowPosition(drag.currentClientX, drag.currentClientY);
    if (!pointerPosition) {
      return;
    }

    let nextPrimaryPosition = {
      x: pointerPosition.x - drag.pointerOffsetX,
      y: pointerPosition.y - drag.pointerOffsetY,
    };
    let delta = {
      x: nextPrimaryPosition.x - drag.startPrimaryPosition.x,
      y: nextPrimaryPosition.y - drag.startPrimaryPosition.y,
    };

    for (let [id, startPosition] of drag.startPositions) {
      this.applyNodePosition(id, {
        x: startPosition.x + delta.x,
        y: startPosition.y + delta.y,
      });
    }

    let node = this.store.getNode(drag.id);
    let event = drag.currentEvent;
    if (node && event) {
      if (!drag.started) {
        drag.started = true;
        this.args.onNodeDragStart?.(event, node as NodeType);
      }
      this.args.onNodeDrag?.(event, node as NodeType);
      if (scheduleAutoPan) {
        this.scheduleNodeAutoPan();
      }
    }
  }

  private handleWindowNodePointerMove = (event: PointerEvent) => {
    let drag = this.activeNodeDrag;
    if (!drag || event.pointerId !== drag.pointerId) {
      return;
    }

    drag.currentClientX = event.clientX;
    drag.currentClientY = event.clientY;
    drag.currentEvent = event;

    if (Math.abs(event.clientX - drag.startClientX) > 1 || Math.abs(event.clientY - drag.startClientY) > 1) {
      drag.didMove = true;
    }

    if (!drag.didMove) {
      return;
    }

    this.applyActiveNodeDrag();
  };

  private handleWindowNodePointerUp = (event: PointerEvent) => {
    let drag = this.activeNodeDrag;
    if (!drag || event.pointerId !== drag.pointerId) {
      return;
    }

    for (let id of drag.startPositions.keys()) {
      this.nodeElement(id)?.classList.remove('dragging');
    }
    if (drag.didMove) {
      this.args.onNodesChange?.(
        Array.from(drag.startPositions.keys()).map((id) => ({
          id,
          type: 'position',
          position: this.store.nodePositions.get(id),
        })) as any,
      );
      this.store.bump();
      this.scheduleSuppressNodeClick();
    }
    let node = this.store.getNode(drag.id);
    if (node && drag.started) {
      this.args.onNodeDragStop?.(event, node as NodeType);
    }
    this.detachNodeDragListeners();
  };

  private scheduleSelectionFrame() {
    if (this.pendingSelectionFrame !== null) {
      return;
    }

    this.pendingSelectionFrame = requestAnimationFrame(() => {
      this.pendingSelectionFrame = null;
      this.renderSelectionRect();
    });
  }

  private flushPendingSelectionFrame() {
    if (this.pendingSelectionFrame !== null) {
      cancelAnimationFrame(this.pendingSelectionFrame);
      this.pendingSelectionFrame = null;
      this.renderSelectionRect();
    }
  }

  private scheduleSuppressNodeClick() {
    this.suppressNodeClick = true;
    this.flushSuppressNodeClickFrame();
    this.suppressNodeClickFrame = requestAnimationFrame(() => {
      this.suppressNodeClick = false;
      this.suppressNodeClickFrame = null;
    });
  }

  private flushSuppressNodeClickFrame() {
    if (this.suppressNodeClickFrame !== null) {
      cancelAnimationFrame(this.suppressNodeClickFrame);
      this.suppressNodeClickFrame = null;
    }
  }

  private handleWindowSelectionPointerMove = (event: PointerEvent) => {
    let selection = this.activeSelection;
    let renderer = this.rendererElement;
    if (!selection || !renderer) {
      return;
    }

    let rect = renderer.getBoundingClientRect();
    selection.currentX = event.clientX - rect.left;
    selection.currentY = event.clientY - rect.top;
    this.scheduleSelectionFrame();
  };

  private handleWindowSelectionPointerUp = () => {
    let selection = this.activeSelection;
    let renderer = this.rendererElement;
    if (!selection || !renderer) {
      this.detachSelectionListeners();
      return;
    }

    this.flushPendingSelectionFrame();
    let rendererRect = renderer.getBoundingClientRect();
    let x = Math.min(selection.startX, selection.currentX);
    let y = Math.min(selection.startY, selection.currentY);
    let width = Math.abs(selection.currentX - selection.startX);
    let height = Math.abs(selection.currentY - selection.startY);
    let selectionRect = {
      left: rendererRect.left + x,
      right: rendererRect.left + x + width,
      top: rendererRect.top + y,
      bottom: rendererRect.top + y + height,
    };

    this.clearSelection();
    for (let node of this.nodes) {
      if (node.selectable === false) {
        continue;
      }
      let element = this.nodeElement(node.id);
      if (!element) {
        continue;
      }
      let nodeRect = element.getBoundingClientRect();
      if (this.isNodeInsideSelection(nodeRect, selectionRect)) {
        this.selectNode(node.id);
      }
    }

    this.suppressPaneClick = true;
    this.detachSelectionListeners();
  };

  private scheduleConnectionFrame() {
    if (this.pendingConnectionFrame !== null) {
      return;
    }

    this.pendingConnectionFrame = requestAnimationFrame(() => {
      this.pendingConnectionFrame = null;
      this.renderConnectionLine();
      this.scheduleConnectionAutoPan();
    });
  }

  private flushPendingConnectionFrame() {
    if (this.pendingConnectionFrame !== null) {
      cancelAnimationFrame(this.pendingConnectionFrame);
      this.pendingConnectionFrame = null;
      this.renderConnectionLine();
    }
  }

  private scheduleConnectionAutoPan() {
    if (this.pendingConnectionAutoPanFrame !== null || !this.activeConnection?.currentEvent) {
      return;
    }

    this.pendingConnectionAutoPanFrame = requestAnimationFrame(() => {
      this.pendingConnectionAutoPanFrame = null;
      void this.autoPanForConnection();
    });
  }

  private handleWindowConnectionPointerMove = (event: PointerEvent) => {
    let connection = this.activeConnection;
    let renderer = this.rendererElement;
    if (!connection || !renderer || event.pointerId !== connection.pointerId) {
      return;
    }

    connection.currentEvent = event;
    this.updateConnectionTargetFromEvent(event);
    this.scheduleConnectionFrame();
    this.scheduleConnectionAutoPan();
  };

  private handleWindowConnectionPointerUp = (event: PointerEvent) => {
    let connection = this.activeConnection;
    if (!connection || event.pointerId !== connection.pointerId) {
      return;
    }

    this.flushPendingConnectionFrame();
    let target = document.elementFromPoint(event.clientX, event.clientY);
    let targetHandle = target?.closest('.ember-flow__handle') as HTMLElement | null;
    let completed = this.completeConnection(connection.targetHandle ?? targetHandle);
    this.args.onConnectEnd?.(event, { isValid: completed } as any);
    if (connection.reconnect) {
      this.args.onReconnectEnd?.(event, connection.reconnect.edge, connection.reconnect.handleType, {
        isValid: completed,
      } as any);
    }
    this.detachConnectionListeners();
  };

  private updateConnectionTargetFromEvent(event: PointerEvent) {
    let connection = this.activeConnection;
    let renderer = this.rendererElement;

    if (!connection || !renderer) {
      return;
    }

    let rendererRect = renderer.getBoundingClientRect();
    let pointerPoint = {
      x: event.clientX - rendererRect.left,
      y: event.clientY - rendererRect.top,
    };
    let candidate = this.findConnectionCandidate(event);

    if (candidate) {
      connection.toX = candidate.point.x;
      connection.toY = candidate.point.y;
      connection.toPosition = candidate.position;
      connection.targetHandle = candidate.handle;
      this.setConnectionTargetHandle(candidate.handle);
      return;
    }

    connection.toX = pointerPoint.x;
    connection.toY = pointerPoint.y;
    connection.toPosition = oppositePosition[connection.fromPosition];
    connection.targetHandle = null;
    this.setConnectionTargetHandle(null);
  }

  private updateConnectionSourceFromAnchor() {
    let connection = this.activeConnection;
    let renderer = this.rendererElement;

    if (!connection || !renderer) {
      return;
    }

    let fromElement =
      connection.fromElement && renderer.contains(connection.fromElement)
        ? connection.fromElement
        : this.findHandleElement(connection.nodeId, connection.handleType, connection.handleId);

    if (!fromElement) {
      return;
    }

    connection.fromElement = fromElement;
    connection.fromPosition = this.getHandlePosition(
      fromElement,
      connection.handleType === 'source' ? Position.Bottom : Position.Top,
    );
    let point = this.getElementRendererPoint(fromElement);
    connection.fromX = point.x;
    connection.fromY = point.y;
  }

  private findHandleElement(nodeId: string, handleType: HandleType, handleId: string | null) {
    let renderer = this.rendererElement;

    if (!renderer) {
      return null;
    }

    for (let handle of renderer.querySelectorAll<HTMLElement>(
      `.ember-flow__handle[data-nodeid="${this.escapeAttribute(nodeId)}"][data-handletype="${handleType}"]`,
    )) {
      if (this.getHandleId(handle) === handleId) {
        return handle;
      }
    }

    return null;
  }

  private findConnectionCandidate(event: PointerEvent) {
    let renderer = this.rendererElement;
    let connection = this.activeConnection;

    if (!renderer || !connection) {
      return null;
    }

    let directHandle = document
      .elementFromPoint(event.clientX, event.clientY)
      ?.closest<HTMLElement>('.ember-flow__handle');
    if (directHandle && renderer.contains(directHandle)) {
      return this.connectionCandidateForHandle(directHandle);
    }

    let pointerPosition = this.clientToFlowPosition(event.clientX, event.clientY);
    if (!pointerPosition) {
      return null;
    }

    let closestCandidate: {
      handle: HTMLElement;
      point: { x: number; y: number };
      position: Position;
      distance: number;
    } | null = null;

    for (let handle of renderer.querySelectorAll<HTMLElement>('.ember-flow__handle')) {
      if (this.isStartingHandle(handle, connection)) {
        continue;
      }

      let handlePoint = this.getElementRendererPoint(handle);
      let handleFlowPoint = pointToRendererPoint(handlePoint, [
        this.store.viewport.x,
        this.store.viewport.y,
        this.store.viewport.zoom,
      ]);
      let distance = Math.hypot(handleFlowPoint.x - pointerPosition.x, handleFlowPoint.y - pointerPosition.y);

      if (distance > this.connectionRadius) {
        continue;
      }

      if (!closestCandidate || distance < closestCandidate.distance) {
        closestCandidate = {
          handle,
          point: handlePoint,
          position: this.getHandlePosition(handle, this.getHandleType(handle) === 'source' ? Position.Bottom : Position.Top),
          distance,
        };
      }
    }

    if (!closestCandidate) {
      return null;
    }

    return this.connectionCandidateForHandle(closestCandidate.handle, closestCandidate.point);
  }

  private connectionCandidateForHandle(handle: HTMLElement, point = this.getElementRendererPoint(handle)) {
    if (!this.buildConnectionPayload(handle)) {
      return null;
    }

    return {
      handle,
      point,
      position: this.getHandlePosition(handle, this.getHandleType(handle) === 'source' ? Position.Bottom : Position.Top),
    };
  }

  private getElementRendererPoint(element: Element) {
    let rendererRect = this.rendererElement?.getBoundingClientRect();
    let handleRect = element.getBoundingClientRect();

    return {
      x: handleRect.left + handleRect.width / 2 - (rendererRect?.left ?? 0),
      y: handleRect.top + handleRect.height / 2 - (rendererRect?.top ?? 0),
    };
  }

  private isStartingHandle(
    handle: HTMLElement,
    connection: { nodeId: string; handleId: string | null; handleType: HandleType },
  ) {
    return (
      handle.dataset['nodeid'] === connection.nodeId &&
      this.getHandleType(handle) === connection.handleType &&
      this.getHandleId(handle) === connection.handleId
    );
  }

  private setConnectionTargetHandle(handle: HTMLElement | null) {
    if (this.connectionTargetHandleElement === handle) {
      return;
    }

    this.connectionTargetHandleElement?.classList.remove('connectingto', 'valid');
    this.connectionTargetHandleElement = handle;
    this.connectionTargetHandleElement?.classList.add('connectingto', 'valid');
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    this.store.addPressedKey(event.key);

    if (isInputDOMNode(event) || this.args.disableKeyboardA11y) {
      return;
    }

    if (event.key !== this.deleteKey) {
      this.moveSelectedNodesWithKeyboard(event);
      return;
    }

    event.preventDefault();
    this.deleteSelectedElements();
  };

  private handleKeyUp = (event: KeyboardEvent) => {
    this.store.removePressedKey(event.key);
  };

  private deleteSelectedElements() {
    let { nodeChanges, edgeChanges } = this.store.deleteSelectedElements({
      nodes: this.nodes,
      edges: this.edges,
      nodesDeletable: this.args.nodesDeletable !== false,
    });

    if (nodeChanges.length > 0) {
      this.args.onNodesChange?.(nodeChanges as any);
    }

    if (edgeChanges.length > 0) {
      this.args.onEdgesChange?.(edgeChanges as any);
    }

    if (nodeChanges.length > 0 || edgeChanges.length > 0) {
      this.emitSelectionChange();
    }
  }

  private moveSelectedNodesWithKeyboard(event: KeyboardEvent) {
    let direction = arrowKeyDiffs[event.key];

    if (!direction) {
      return;
    }

    let changes = this.store.moveSelectedNodes(direction, event.shiftKey ? 4 : 1);

    if (changes.length === 0) {
      return;
    }

    event.preventDefault();

    for (let change of changes) {
      if (change.type !== 'position') {
        continue;
      }

      let internalNode = this.store.getInternalNode(change.id);
      let element = this.nodeElement(change.id);

      if (internalNode && element) {
        let { positionAbsolute } = internalNode.internals;
        element.style.transform = `translate(${positionAbsolute.x}px, ${positionAbsolute.y}px)`;
      }

      this.updateConnectedEdges(change.id);
    }

    this.args.onNodesChange?.(changes);
  }

  private detachNodeDragListeners() {
    window.removeEventListener('pointermove', this.handleWindowNodePointerMove);
    window.removeEventListener('pointerup', this.handleWindowNodePointerUp);
    window.removeEventListener('pointercancel', this.handleWindowNodePointerUp);
    if (this.pendingNodeAutoPanFrame !== null) {
      cancelAnimationFrame(this.pendingNodeAutoPanFrame);
      this.pendingNodeAutoPanFrame = null;
    }
    this.activeNodeDrag = null;
  }

  private detachSelectionListeners(hide = true) {
    window.removeEventListener('pointermove', this.handleWindowSelectionPointerMove);
    window.removeEventListener('pointerup', this.handleWindowSelectionPointerUp);
    window.removeEventListener('pointercancel', this.handleWindowSelectionPointerUp);
    if (this.pendingSelectionFrame !== null) {
      cancelAnimationFrame(this.pendingSelectionFrame);
      this.pendingSelectionFrame = null;
    }
    this.activeSelection = null;

    if (hide && this.selectionElement) {
      this.selectionElement.style.opacity = '0';
    }
  }

  private detachConnectionListeners() {
    window.removeEventListener('pointermove', this.handleWindowConnectionPointerMove);
    window.removeEventListener('pointerup', this.handleWindowConnectionPointerUp);
    window.removeEventListener('pointercancel', this.handleWindowConnectionPointerUp);
    if (this.pendingConnectionFrame !== null) {
      cancelAnimationFrame(this.pendingConnectionFrame);
      this.pendingConnectionFrame = null;
    }
    if (this.pendingConnectionAutoPanFrame !== null) {
      cancelAnimationFrame(this.pendingConnectionAutoPanFrame);
      this.pendingConnectionAutoPanFrame = null;
    }
    this.setConnectionTargetHandle(null);
    this.activeConnection = null;

    if (this.connectionLineElement) {
      this.connectionLineElement.style.display = 'none';
    }
  }

  private renderSelectionRect() {
    let selection = this.activeSelection;
    let element = this.selectionElement;
    if (!selection || !element) {
      return;
    }

    let x = Math.min(selection.startX, selection.currentX);
    let y = Math.min(selection.startY, selection.currentY);
    let width = Math.abs(selection.currentX - selection.startX);
    let height = Math.abs(selection.currentY - selection.startY);

    element.style.opacity = '1';
    element.style.transform = `translate(${x}px, ${y}px)`;
    element.style.width = `${width}px`;
    element.style.height = `${height}px`;
  }

  private renderConnectionLine() {
    let connection = this.activeConnection;
    let line = this.connectionLineElement;
    let path = this.connectionPathElement;
    let renderer = this.rendererElement;
    if (!connection || !line || !path || !renderer) {
      return;
    }

    this.updateConnectionSourceFromAnchor();
    line.setAttribute('width', `${renderer.clientWidth}`);
    line.setAttribute('height', `${renderer.clientHeight}`);
    line.style.display = 'block';
    line
      .querySelector('.ember-flow__connection')
      ?.setAttribute('class', `ember-flow__connection ${getConnectionStatus(Boolean(connection.targetHandle))}`);
    path.setAttribute('d', this.getConnectionLinePath(connection));
    path.setAttribute('style', toCss(this.args.connectionLineStyle));
  }

  private getConnectionLinePath(connection: NonNullable<typeof this.activeConnection>) {
    let pathParams = {
      sourceX: connection.fromX,
      sourceY: connection.fromY,
      sourcePosition: connection.fromPosition,
      targetX: connection.toX,
      targetY: connection.toY,
      targetPosition: connection.toPosition,
    };

    switch (this.args.connectionLineType ?? ConnectionLineType.Bezier) {
      case ConnectionLineType.Bezier:
        return getBezierPath(pathParams)[0];
      case ConnectionLineType.SimpleBezier:
        return getSimpleBezierPath(pathParams)[0];
      case ConnectionLineType.Step:
        return getSmoothStepPath({ ...pathParams, borderRadius: 0 })[0];
      case ConnectionLineType.SmoothStep:
        return getSmoothStepPath(pathParams)[0];
      case ConnectionLineType.Straight:
      default:
        return getStraightPath(pathParams)[0];
    }
  }

  private completeConnection(targetHandle: HTMLElement | null) {
    let connection = this.activeConnection;
    let connectionPayload = targetHandle ? this.buildConnectionPayload(targetHandle) : null;

    if (!connection || !connectionPayload) {
      return false;
    }

    if (connection.reconnect) {
      let oldEdge = connection.reconnect.edge;
      let nextEdge = {
        ...oldEdge,
        ...connectionPayload,
      } as EdgeType;

      this.store.updateEdge(oldEdge.id, nextEdge, { replace: true });
      this.args.onReconnect?.(oldEdge, connectionPayload);
      this.args.onEdgesChange?.([{ id: oldEdge.id, type: 'replace', item: nextEdge }] as any);

      return true;
    }

    let id = getEdgeId(connectionPayload);
    if (this.edges.some((edge) => edge.id === id)) {
      return false;
    }

    let edge = {
      id,
      source: connectionPayload.source,
      target: connectionPayload.target,
      sourceHandle: connectionPayload.sourceHandle,
      targetHandle: connectionPayload.targetHandle,
    } as EdgeType;

    this.store.addEdge(edge);
    this.args.onConnect?.(connectionPayload);
    this.args.onEdgesChange?.([{ id, type: 'add', item: edge }] as any);

    return true;
  }

  private buildConnectionPayload(targetHandle: HTMLElement): Connection | null {
    let connection = this.activeConnection;
    if (!connection) {
      return null;
    }

    let targetNodeId = targetHandle.dataset['nodeid'];
    if (!targetNodeId || targetNodeId === connection.nodeId) {
      return null;
    }

    let targetNode = this.nodes.find((node) => node.id === targetNodeId);
    if (!targetNode || targetNode.connectable === false) {
      return null;
    }

    if (!this.canEndConnection(targetHandle)) {
      return null;
    }

    let targetHandleType = this.getHandleType(targetHandle);
    if (!targetHandleType) {
      return null;
    }

    let targetHandleId = this.getHandleId(targetHandle);
    let sourceId: string | null = null;
    let destinationId: string | null = null;
    let sourceHandle: string | null = null;
    let targetHandleIdForPayload: string | null = null;

    if (
      connection.handleType === 'source' &&
      (targetHandleType === 'target' || this.connectionMode === ConnectionMode.Loose)
    ) {
      sourceId = connection.nodeId;
      destinationId = targetNodeId;
      sourceHandle = connection.handleId;
      targetHandleIdForPayload = targetHandleId;
    } else if (
      connection.handleType === 'target' &&
      (targetHandleType === 'source' || this.connectionMode === ConnectionMode.Loose)
    ) {
      sourceId = targetNodeId;
      destinationId = connection.nodeId;
      sourceHandle = targetHandleId;
      targetHandleIdForPayload = connection.handleId;
    }

    if (!sourceId || !destinationId) {
      return null;
    }

    let connectionPayload: Connection = {
      source: sourceId,
      target: destinationId,
      sourceHandle,
      targetHandle: targetHandleIdForPayload,
    };

    if (this.args.isValidConnection && !this.args.isValidConnection(connectionPayload)) {
      return null;
    }

    return connectionPayload;
  }

  private clearSelection() {
    let selectedNodeIds = this.nodes
      .filter((node) => node.selected || this.store.selectedNodeIds.has(node.id))
      .map((node) => node.id);
    let selectedEdgeIds = this.edges
      .filter((edge) => edge.selected || this.store.selectedEdgeIds.has(edge.id))
      .map((edge) => edge.id);

    for (let id of selectedNodeIds) {
      this.nodeElement(id)?.classList.remove('selected');
    }
    for (let id of selectedEdgeIds) {
      this.edgeElement(id)?.classList.remove('selected');
    }

    this.store.clearSelection();

    if (selectedNodeIds.length > 0) {
      this.args.onNodesChange?.(
        selectedNodeIds.map((id) => ({ id, type: 'select', selected: false }) as NodeChange<NodeType>),
      );
    }

    if (selectedEdgeIds.length > 0) {
      this.args.onEdgesChange?.(
        selectedEdgeIds.map((id) => ({ id, type: 'select', selected: false }) as EdgeChange<EdgeType>),
      );
    }

    if (selectedNodeIds.length > 0 || selectedEdgeIds.length > 0) {
      this.args.onSelectionChange?.({ nodes: [], edges: [] });
    }
  }

  private selectNode(id: string) {
    let didSelect = this.store.selectNode(id);
    this.nodeElement(id)?.classList.add('selected');
    this.args.onNodesChange?.([{ id, type: 'select', selected: true }] as NodeChange<NodeType>[]);
    if (didSelect) {
      this.emitSelectionChange();
    }
    return didSelect;
  }

  private selectEdge(id: string) {
    let didSelect = this.store.selectEdge(id);
    this.edgeElement(id)?.classList.add('selected');
    this.args.onEdgesChange?.([{ id, type: 'select', selected: true }] as EdgeChange<EdgeType>[]);
    if (didSelect) {
      this.emitSelectionChange();
    }
    return didSelect;
  }

  private emitSelectionChange() {
    this.args.onSelectionChange?.({
      nodes: this.store.selectedNodes as NodeType[],
      edges: this.store.selectedEdges as EdgeType[],
    });
  }

  private applyNodePosition(id: string, position: { x: number; y: number }) {
    let node = this.store.getNode(id);
    if (!node) {
      return;
    }

    let { positionAbsolute } = this.store.setNodeAbsolutePosition(id, node, position);

    let element = this.nodeElement(id);
    if (element) {
      element.style.transform = `translate(${positionAbsolute.x}px, ${positionAbsolute.y}px)`;
    }

    this.updateConnectedEdges(id);
  }

  handleNodeResize = (event: CustomEvent<NodeResizeDetail>) => {
    event.stopPropagation();

    if (event.detail.resizing) {
      this.applyNodeResize(event.detail, false);
      return;
    }

    this.applyNodeResize(event.detail, true);
  };

  private applyNodeResize(detail: NodeResizeDetail, commit: boolean) {
    let node = this.store.getNode(detail.id);
    if (!node) {
      return;
    }

    let dimensions = this.store.setNodeDimensions(detail.id, detail.dimensions);
    let position = this.store.setNodePosition(detail.id, detail.position);
    let positionAbsolute = this.store.getNodePosition(node);
    let element = this.nodeElement(detail.id);

    if (element) {
      element.style.transform = `translate(${positionAbsolute.x}px, ${positionAbsolute.y}px)`;
      element.style.width = `${dimensions.width}px`;
      element.style.height = `${dimensions.height}px`;
    }

    this.updateConnectedEdges(detail.id);

    if (commit) {
      this.args.onNodesChange?.([
        {
          id: detail.id,
          type: 'position',
          position,
        },
        {
          id: detail.id,
          type: 'dimensions',
          dimensions,
          resizing: false,
          setAttributes: true,
        },
      ] as any);
      this.store.bump();
    }
  }

  private updateConnectedEdges(nodeId: string) {
    for (let edge of this.store.getConnectedEdges(nodeId)) {
      let source = this.store.getNode(edge.source);
      let target = this.store.getNode(edge.target);
      let edgeElement = this.edgeElement(edge.id);

      if (!source || !target || !edgeElement) {
        continue;
      }

      let [edgePath, labelX, labelY] = getEdgePathData(edge, source, target, {
        getNodePosition: (node) => this.store.getNodePosition(node),
        getNodeWidth: (node) => this.store.getNodeWidth(node),
        getNodeHeight: (node) => this.store.getNodeHeight(node),
      });
      for (let path of edgeElement.querySelectorAll<SVGPathElement>(
        '.ember-flow__edge-path, .ember-flow__edge-interaction, .ember-flow__edge-selection',
      )) {
        path.setAttribute('d', edgePath);
      }
      edgeElement
        ?.querySelector<SVGGElement>('.ember-flow__edge-textwrapper')
        ?.setAttribute('transform', `translate(${labelX} ${labelY})`);
      this.updateEdgeToolbar(edge.id, labelX, labelY);
    }
  }

  private updateEdgeToolbar(edgeId: string, x: number, y: number) {
    let toolbar = this.rendererElement?.querySelector<HTMLElement>(
      `.ember-flow__edge-toolbar[data-id="${this.escapeAttribute(edgeId)}"]`,
    );

    if (!toolbar) {
      return;
    }

    let offset = Number(toolbar.dataset['offset'] ?? 10);
    let position = toolbar.dataset['position'] as Position | undefined;
    let alignX = toolbar.dataset['alignX'] as 'left' | 'center' | 'right' | undefined;
    let alignY = toolbar.dataset['alignY'] as 'top' | 'center' | 'bottom' | undefined;
    let screenOffset = this.getToolbarScreenOffset(position, Number.isFinite(offset) ? offset : 10);

    toolbar.style.transform = getViewportOverlayTransform({
      x,
      y,
      zoom: this.store.viewport.zoom,
      offsetX: screenOffset.x,
      offsetY: screenOffset.y,
      alignX: alignX ?? 'center',
      alignY: alignY ?? 'center',
    });
  }

  private getToolbarScreenOffset(position: Position | undefined, offset: number) {
    switch (position) {
      case Position.Top:
        return { x: 0, y: -offset };
      case Position.Right:
        return { x: offset, y: 0 };
      case Position.Bottom:
        return { x: 0, y: offset };
      case Position.Left:
        return { x: -offset, y: 0 };
      default:
        return { x: 0, y: 0 };
    }
  }

  private getHandleType(handle: HTMLElement): HandleType | null {
    let dataType = handle.dataset['handletype'];
    if (dataType === 'source' || dataType === 'target') {
      return dataType;
    }

    if (handle.classList.contains('source')) {
      return 'source';
    }

    if (handle.classList.contains('target')) {
      return 'target';
    }

    return null;
  }

  private getHandlePosition(handle: Element, fallback: Position) {
    let position = (handle as HTMLElement).dataset?.['handlepos'];

    switch (position) {
      case Position.Left:
      case Position.Right:
      case Position.Top:
      case Position.Bottom:
        return position;
      default:
        return fallback;
    }
  }

  private getHandleId(handle: HTMLElement) {
    let id = handle.dataset['handleid'];
    return id && id !== 'null' ? id : null;
  }

  private canStartConnection(handle: HTMLElement) {
    return !handle.classList.contains('connectable') || handle.classList.contains('connectablestart');
  }

  private canEndConnection(handle: HTMLElement) {
    return !handle.classList.contains('connectable') || handle.classList.contains('connectableend');
  }

  private isSelectionKeyActive(event: PointerEvent | MouseEvent) {
    let selectionKey = this.args.selectionKey ?? 'Shift';
    if (selectionKey === null) {
      return false;
    }

    let keys = Array.isArray(selectionKey) ? selectionKey : [selectionKey];

    return keys.some((key) => {
      switch (key) {
        case 'Shift':
          return event.shiftKey;
        case 'Meta':
          return event.metaKey;
        case 'Control':
        case 'Ctrl':
          return event.ctrlKey;
        case 'Alt':
          return event.altKey;
        default:
          return this.store.pressedKeys.has(key);
      }
    });
  }

  private isNodeInsideSelection(
    nodeRect: { left: number; right: number; top: number; bottom: number },
    selectionRect: { left: number; right: number; top: number; bottom: number },
  ) {
    let intersects =
      nodeRect.left <= selectionRect.right &&
      nodeRect.right >= selectionRect.left &&
      nodeRect.top <= selectionRect.bottom &&
      nodeRect.bottom >= selectionRect.top;

    if (this.selectionMode === SelectionMode.Partial) {
      return intersects;
    }

    return (
      intersects &&
      nodeRect.left >= selectionRect.left &&
      nodeRect.right <= selectionRect.right &&
      nodeRect.top >= selectionRect.top &&
      nodeRect.bottom <= selectionRect.bottom
    );
  }

  private clientToFlowPosition(clientX: number, clientY: number) {
    let renderer = this.rendererElement;
    if (!renderer) {
      return null;
    }

    let rect = renderer.getBoundingClientRect();

    return pointToRendererPoint(
      {
        x: clientX - rect.left,
        y: clientY - rect.top,
      },
      [this.store.viewport.x, this.store.viewport.y, this.store.viewport.zoom],
    );
  }

  private scheduleNodeAutoPan() {
    if (this.pendingNodeAutoPanFrame !== null) {
      return;
    }

    this.pendingNodeAutoPanFrame = requestAnimationFrame(() => {
      this.pendingNodeAutoPanFrame = null;
      void this.autoPanForNodeDrag();
    });
  }

  private async autoPanForNodeDrag() {
    let drag = this.activeNodeDrag;
    if (this.args.autoPanOnNodeDrag === false || !this.rendererElement) {
      return;
    }

    let rect = this.rendererElement.getBoundingClientRect();
    if (!drag?.didMove) {
      return;
    }

    let [x = 0, y = 0] = calcAutoPan(
      {
        x: drag.currentClientX - rect.left,
        y: drag.currentClientY - rect.top,
      },
      { width: rect.width, height: rect.height },
      this.args.autoPanSpeed ?? 15,
    );

    if (x !== 0 || y !== 0) {
      let changed = await this.store.panBy({ x, y });
      if (changed && this.activeNodeDrag === drag) {
        this.applyViewportTransform(this.store.viewport);
        this.applyActiveNodeDrag(false);
      }

      if (this.activeNodeDrag === drag) {
        this.scheduleNodeAutoPan();
      }
    }
  }

  private async autoPanForConnection() {
    let connection = this.activeConnection;
    let event = connection?.currentEvent;

    if (this.args.autoPanOnConnect === false || !this.rendererElement || !connection || !event) {
      return;
    }

    let rect = this.rendererElement.getBoundingClientRect();
    let [x = 0, y = 0] = calcAutoPan(
      {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      },
      { width: rect.width, height: rect.height },
      this.args.autoPanSpeed ?? 15,
    );

    if (x !== 0 || y !== 0) {
      let changed = await this.store.panBy({ x, y });

      if (changed && this.activeConnection === connection) {
        this.applyViewportTransform(this.store.viewport);
        this.updateConnectionSourceFromAnchor();
        this.updateConnectionTargetFromEvent(event);
        this.renderConnectionLine();
      }

      if (this.activeConnection === connection) {
        this.scheduleConnectionAutoPan();
      }
    }
  }

  nodeComponentFor = (node: Node): NodeComponent | undefined => {
    let type = node.type;
    return type ? this.args.nodeTypes?.[type] : undefined;
  };

  nodePositionFor = (node: Node) => {
    return this.store.getNodePosition(node);
  };

  nodeWidthFor = (node: Node) => {
    return this.store.getNodeWidth(node);
  };

  nodeHeightFor = (node: Node) => {
    return this.store.getNodeHeight(node);
  };

  private nodeElement(id: string) {
    return this.rendererElement?.querySelector<HTMLElement>(
      `.ember-flow__node[data-id="${this.escapeAttribute(id)}"]`,
    );
  }

  private edgeElement(id: string) {
    return this.rendererElement?.querySelector<SVGGElement>(
      `.ember-flow__edge[data-id="${this.escapeAttribute(id)}"]`,
    );
  }

  private escapeAttribute(value: string) {
    return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  }

  <template>
    <div
      class={{this.rootClasses}}
      data-testid='ember-flow__wrapper'
      role='application'
      style={{this.rootStyle}}
      {{flowStore this.store}}
      ...attributes
    >
      <div
        class='ember-flow__renderer ember-flow__container'
        {{panZoom this}}
        {{listen 'click' this.handleRendererClick}}
        {{listen 'ember-flow:node-resize' this.handleNodeResize}}
      >
        <div
          class='ember-flow__pane ember-flow__container draggable'
          {{listen 'pointerdown' this.handlePanePointerDown}}
        ></div>
        <div
          class='ember-flow__viewport emberflow__viewport ember-flow__container'
          style={{this.viewportStyle}}
        >
          <div class='ember-flow__viewport-back ember-flow__container'></div>
          <div class='ember-flow__edges'>
            {{#each this.edgeItems key='edge.id' as |item|}}
              <FlowEdge
                @edge={{item.edge}}
                @source={{item.source}}
                @target={{item.target}}
                @edgesReconnectable={{this.edgesReconnectable}}
                @reconnectRadius={{this.reconnectRadius}}
                @getNodePosition={{this.nodePositionFor}}
                @getNodeWidth={{this.nodeWidthFor}}
                @getNodeHeight={{this.nodeHeightFor}}
                @onReconnectPointerDown={{this.handleEdgeReconnectPointerDown}}
              />
            {{/each}}
          </div>
          <div class='ember-flow__edge-labels ember-flow__edgelabel-renderer ember-flow__container'></div>
          <div class='ember-flow__nodes'>
            {{#each this.renderedNodes key='id' as |node|}}
              {{#unless node.hidden}}
                <FlowNode
                  @node={{node}}
                  @position={{this.nodePositionFor node}}
                  @nodeComponent={{this.nodeComponentFor node}}
                  @onNodeClick={{this.handleNodeClick}}
                  @onNodePointerDown={{this.handleNodePointerDown}}
                  @onHandlePointerDown={{this.handleHandlePointerDown}}
                />
              {{/unless}}
            {{/each}}
          </div>
          <div class='ember-flow__viewport-front ember-flow__container'></div>
        </div>
        <svg class='ember-flow__connectionline ember-flow__container' style={{this.connectionLineInitialStyle}}>
          <g class='ember-flow__connection'>
            <path class='ember-flow__connection-path' style={{this.connectionLinePathStyle}} fill='none' />
          </g>
        </svg>
        <div class='ember-flow__selection'></div>
      </div>
      {{yield this.store}}
    </div>
  </template>
}

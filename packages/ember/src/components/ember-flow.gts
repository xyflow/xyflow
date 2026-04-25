import Component from '@glimmer/component';
import type Owner from '@ember/owner';
import { htmlSafe } from '@ember/template';
import {
  infiniteExtent,
  PanOnScrollMode,
  Position,
  XYPanZoom,
  getEdgeId,
  getStraightPath,
  type Transform,
  type Viewport,
} from '@xyflow/system';

import listen from '../modifiers/listen.js';
import flowStore from '../modifiers/flow-store.js';
import panZoom from '../modifiers/pan-zoom.js';
import EmberFlowStore from '../store/index.js';
import { getEdgePathData } from '../utils/edge-path.js';
import { getViewportOverlayTransform } from '../utils/viewport-overlay.js';
import FlowEdge from './flow-edge.js';
import FlowNode from './flow-node.js';
import type { Connection, Edge, EmberFlowArgs, Node, NodeComponent } from '../types.js';

type HandleType = 'source' | 'target';

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
  private didFitView = false;
  private didSetInitialInteractivity = false;
  private suppressPaneClick = false;
  private activeNodeDrag: {
    id: string;
    pointerId: number;
    startClientX: number;
    startClientY: number;
    startPosition: { x: number; y: number };
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
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
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
    return this.store.getEdges(this.args.edges ?? []);
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

  get edgeItems(): EdgeRenderItem<EdgeType, NodeType>[] {
    let nodesById = new Map(this.nodes.map((node) => [node.id, node]));

    return this.edges
      .map((edge) => {
        let source = nodesById.get(edge.source);
        let target = nodesById.get(edge.target);

        if (!source || !target || edge.hidden) {
          return null;
        }

        return { edge, source, target };
      })
      .filter((item): item is EdgeRenderItem<EdgeType, NodeType> => item !== null);
  }

  installPanZoom(element: HTMLDivElement) {
    this.rendererElement = element;
    this.viewportElement = element.querySelector<HTMLDivElement>('.ember-flow__viewport');
    this.selectionElement = element.querySelector<HTMLDivElement>('.ember-flow__selection');
    this.connectionLineElement = element.querySelector<SVGSVGElement>('.ember-flow__connectionline');
    this.connectionPathElement = element.querySelector<SVGPathElement>('.ember-flow__connection-path');
    this.store.setViewportDimensions(element.clientWidth, element.clientHeight);
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
    this.applyViewportTransform(this.store.viewport);
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
      selectionOnDrag: false,
    });

    if (this.args.fitView && !this.didFitView) {
      this.didFitView = true;
      requestAnimationFrame(() => {
        this.store.setViewportDimensions(element.clientWidth, element.clientHeight);
        void this.store.fitView();
      });
    }
  }

  uninstallPanZoom() {
    this.store.panZoom?.destroy();
    this.store.panZoom = null;
    this.rendererElement = null;
    this.viewportElement = null;
    this.selectionElement = null;
    this.connectionLineElement = null;
    this.connectionPathElement = null;
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
    this.store.setViewport({ x: transform[0], y: transform[1], zoom: transform[2] });
    this.applyViewportTransform(this.store.viewport);
  };

  private configureStorePlacement() {
    this.store.setNodeOrigin(this.args.nodeOrigin ?? [0, 0]);
    this.store.setNodeExtent(this.args.nodeExtent ?? infiniteExtent);
    this.store.setTranslateExtent(this.args.translateExtent ?? infiniteExtent);
    this.store.setSnapGrid(this.args.snapToGrid ?? false, this.args.snapGrid ?? [15, 15]);
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

  private getViewportTransform(viewport: Viewport) {
    return `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`;
  }

  handleNodeClick = (node: Node, event: MouseEvent) => {
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

    if (node.dragHandle && !target?.closest(node.dragHandle)) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    this.activeNodeDrag = {
      id: node.id,
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startClientY: event.clientY,
      startPosition: this.store.getNodePosition(node),
      didMove: false,
      started: false,
    };

    this.nodeElement(node.id)?.classList.add('dragging');
    window.addEventListener('pointermove', this.handleWindowNodePointerMove);
    window.addEventListener('pointerup', this.handleWindowNodePointerUp);
    window.addEventListener('pointercancel', this.handleWindowNodePointerUp);
  };

  handlePanePointerDown = (event: PointerEvent) => {
    if (!event.shiftKey || event.button !== 0 || !this.elementsSelectable) {
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

    this.activeConnection = {
      nodeId: node.id,
      handleId: this.getHandleId(handle),
      handleType,
      pointerId: event.pointerId,
      fromX,
      fromY,
      toX: event.clientX - rendererRect.left,
      toY: event.clientY - rendererRect.top,
    };

    this.renderConnectionLine();
    window.addEventListener('pointermove', this.handleWindowConnectionPointerMove);
    window.addEventListener('pointerup', this.handleWindowConnectionPointerUp);
    window.addEventListener('pointercancel', this.handleWindowConnectionPointerUp);
  };

  private handleWindowNodePointerMove = (event: PointerEvent) => {
    let drag = this.activeNodeDrag;
    if (!drag || event.pointerId !== drag.pointerId) {
      return;
    }

    let dx = (event.clientX - drag.startClientX) / this.store.viewport.zoom;
    let dy = (event.clientY - drag.startClientY) / this.store.viewport.zoom;

    if (Math.abs(event.clientX - drag.startClientX) > 1 || Math.abs(event.clientY - drag.startClientY) > 1) {
      drag.didMove = true;
    }

    if (!drag.didMove) {
      return;
    }

    this.applyNodePosition(drag.id, {
      x: drag.startPosition.x + dx,
      y: drag.startPosition.y + dy,
    });
    let node = this.nodes.find((candidate) => candidate.id === drag.id);
    if (node) {
      if (!drag.started) {
        drag.started = true;
        this.args.onNodeDragStart?.(event, node as NodeType);
      }
      this.args.onNodeDrag?.(event, node as NodeType);
    }
    this.autoPanForNodeDrag(event);
  };

  private handleWindowNodePointerUp = (event: PointerEvent) => {
    let drag = this.activeNodeDrag;
    if (!drag || event.pointerId !== drag.pointerId) {
      return;
    }

    this.nodeElement(drag.id)?.classList.remove('dragging');
    if (drag.didMove) {
      let position = this.store.nodePositions.get(drag.id);
      this.args.onNodesChange?.([{ id: drag.id, type: 'position', position }] as any);
      this.store.bump();
    }
    let node = this.nodes.find((candidate) => candidate.id === drag.id);
    if (node && drag.started) {
      this.args.onNodeDragStop?.(event, node as NodeType);
    }
    this.detachNodeDragListeners();
  };

  private handleWindowSelectionPointerMove = (event: PointerEvent) => {
    let selection = this.activeSelection;
    let renderer = this.rendererElement;
    if (!selection || !renderer) {
      return;
    }

    let rect = renderer.getBoundingClientRect();
    selection.currentX = event.clientX - rect.left;
    selection.currentY = event.clientY - rect.top;
    this.renderSelectionRect();
  };

  private handleWindowSelectionPointerUp = () => {
    let selection = this.activeSelection;
    let renderer = this.rendererElement;
    if (!selection || !renderer) {
      this.detachSelectionListeners();
      return;
    }

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
      if (
        nodeRect.left <= selectionRect.right &&
        nodeRect.right >= selectionRect.left &&
        nodeRect.top <= selectionRect.bottom &&
        nodeRect.bottom >= selectionRect.top
      ) {
        this.selectNode(node.id);
      }
    }

    this.suppressPaneClick = true;
    this.detachSelectionListeners(false);
  };

  private handleWindowConnectionPointerMove = (event: PointerEvent) => {
    let connection = this.activeConnection;
    let renderer = this.rendererElement;
    if (!connection || !renderer || event.pointerId !== connection.pointerId) {
      return;
    }

    let rendererRect = renderer.getBoundingClientRect();
    connection.toX = event.clientX - rendererRect.left;
    connection.toY = event.clientY - rendererRect.top;
    this.renderConnectionLine();
    this.autoPanForConnection(event);
  };

  private handleWindowConnectionPointerUp = (event: PointerEvent) => {
    let connection = this.activeConnection;
    if (!connection || event.pointerId !== connection.pointerId) {
      return;
    }

    let target = document.elementFromPoint(event.clientX, event.clientY);
    let targetHandle = target?.closest('.ember-flow__handle') as HTMLElement | null;
    this.completeConnection(targetHandle);
    this.detachConnectionListeners();
  };

  private handleKeyDown = (event: KeyboardEvent) => {
    this.store.addPressedKey(event.key);

    if (event.key !== this.deleteKey) {
      return;
    }

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

  private detachNodeDragListeners() {
    window.removeEventListener('pointermove', this.handleWindowNodePointerMove);
    window.removeEventListener('pointerup', this.handleWindowNodePointerUp);
    window.removeEventListener('pointercancel', this.handleWindowNodePointerUp);
    this.activeNodeDrag = null;
  }

  private detachSelectionListeners(hide = true) {
    window.removeEventListener('pointermove', this.handleWindowSelectionPointerMove);
    window.removeEventListener('pointerup', this.handleWindowSelectionPointerUp);
    window.removeEventListener('pointercancel', this.handleWindowSelectionPointerUp);
    this.activeSelection = null;

    if (hide && this.selectionElement) {
      this.selectionElement.style.opacity = '0';
    }
  }

  private detachConnectionListeners() {
    window.removeEventListener('pointermove', this.handleWindowConnectionPointerMove);
    window.removeEventListener('pointerup', this.handleWindowConnectionPointerUp);
    window.removeEventListener('pointercancel', this.handleWindowConnectionPointerUp);
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

    line.setAttribute('width', `${renderer.clientWidth}`);
    line.setAttribute('height', `${renderer.clientHeight}`);
    line.style.display = 'block';
    path.setAttribute(
      'd',
      getStraightPath({
        sourceX: connection.fromX,
        sourceY: connection.fromY,
        targetX: connection.toX,
        targetY: connection.toY,
      })[0],
    );
  }

  private completeConnection(targetHandle: HTMLElement | null) {
    let connection = this.activeConnection;
    if (!connection || !targetHandle) {
      return;
    }

    let targetNodeId = targetHandle.dataset['nodeid'];
    if (!targetNodeId || targetNodeId === connection.nodeId) {
      return;
    }

    let targetNode = this.nodes.find((node) => node.id === targetNodeId);
    if (!targetNode || targetNode.connectable === false) {
      return;
    }

    if (!this.canEndConnection(targetHandle)) {
      return;
    }

    let targetHandleType = this.getHandleType(targetHandle);
    if (!targetHandleType) {
      return;
    }

    let targetHandleId = this.getHandleId(targetHandle);
    let sourceId: string | null = null;
    let destinationId: string | null = null;
    let sourceHandle: string | null = null;
    let targetHandleIdForPayload: string | null = null;

    if (connection.handleType === 'source' && targetHandleType === 'target') {
      sourceId = connection.nodeId;
      destinationId = targetNodeId;
      sourceHandle = connection.handleId;
      targetHandleIdForPayload = targetHandleId;
    } else if (connection.handleType === 'target' && targetHandleType === 'source') {
      sourceId = targetNodeId;
      destinationId = connection.nodeId;
      sourceHandle = targetHandleId;
      targetHandleIdForPayload = connection.handleId;
    }

    if (!sourceId || !destinationId) {
      return;
    }

    let connectionPayload: Connection = {
      source: sourceId,
      target: destinationId,
      sourceHandle,
      targetHandle: targetHandleIdForPayload,
    };
    let id = getEdgeId(connectionPayload);
    if (this.edges.some((edge) => edge.id === id)) {
      return;
    }

    let edge = {
      id,
      source: sourceId,
      target: destinationId,
      sourceHandle,
      targetHandle: targetHandleIdForPayload,
    } as EdgeType;

    this.store.addEdge(edge);
    this.args.onConnect?.(connectionPayload);
    this.args.onEdgesChange?.([{ id, type: 'add', item: edge }] as any);
  }

  private clearSelection() {
    for (let id of this.store.selectedNodeIds) {
      this.nodeElement(id)?.classList.remove('selected');
    }
    for (let id of this.store.selectedEdgeIds) {
      this.edgeElement(id)?.classList.remove('selected');
    }
    if (this.store.clearSelection()) {
      this.emitSelectionChange();
    }
  }

  private selectNode(id: string) {
    let didSelect = this.store.selectNode(id);
    this.nodeElement(id)?.classList.add('selected');
    this.args.onNodesChange?.([{ id, type: 'select' }] as any);
    if (didSelect) {
      this.emitSelectionChange();
    }
    return didSelect;
  }

  private selectEdge(id: string) {
    let didSelect = this.store.selectEdge(id);
    this.edgeElement(id)?.classList.add('selected');
    this.args.onEdgesChange?.([{ id, type: 'select' }] as any);
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
    let node = this.nodes.find((candidate) => candidate.id === id);
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
    this.applyNodeResize(event.detail);
  };

  private applyNodeResize(detail: NodeResizeDetail) {
    let node = this.nodes.find((candidate) => candidate.id === detail.id);
    if (!node) {
      return;
    }

    let dimensions = this.store.setNodeDimensions(detail.id, detail.dimensions);
    let { position, positionAbsolute } = this.store.setNodeAbsolutePosition(detail.id, node, detail.position);
    let element = this.nodeElement(detail.id);

    if (element) {
      element.style.transform = `translate(${positionAbsolute.x}px, ${positionAbsolute.y}px)`;
      element.style.width = `${dimensions.width}px`;
      element.style.height = `${dimensions.height}px`;
    }

    this.updateConnectedEdges(detail.id);
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
        resizing: detail.resizing,
        setAttributes: true,
      },
    ] as any);
    this.store.bump();
  }

  private updateConnectedEdges(nodeId: string) {
    for (let edge of this.edges) {
      if (edge.source !== nodeId && edge.target !== nodeId) {
        continue;
      }

      let source = this.nodes.find((node) => node.id === edge.source);
      let target = this.nodes.find((node) => node.id === edge.target);
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

  private autoPanForNodeDrag(event: PointerEvent) {
    if (this.args.autoPanOnNodeDrag === false || !this.rendererElement) {
      return;
    }

    let rect = this.rendererElement.getBoundingClientRect();
    let threshold = 40;
    let speed = this.args.autoPanSpeed ?? 15;
    let x = 0;
    let y = 0;

    if (event.clientX < rect.left + threshold) {
      x = speed;
    } else if (event.clientX > rect.right - threshold) {
      x = -speed;
    }

    if (event.clientY < rect.top + threshold) {
      y = speed;
    } else if (event.clientY > rect.bottom - threshold) {
      y = -speed;
    }

    if (x !== 0 || y !== 0) {
      void this.store.panBy({ x, y }).then(() => this.applyViewportTransform(this.store.viewport));
    }
  }

  private autoPanForConnection(event: PointerEvent) {
    if (this.args.autoPanOnConnect === false || !this.rendererElement) {
      return;
    }

    let rect = this.rendererElement.getBoundingClientRect();
    let threshold = 40;
    let speed = this.args.autoPanSpeed ?? 15;
    let x = 0;
    let y = 0;

    if (event.clientX < rect.left + threshold) {
      x = speed;
    } else if (event.clientX > rect.right - threshold) {
      x = -speed;
    }

    if (event.clientY < rect.top + threshold) {
      y = speed;
    } else if (event.clientY > rect.bottom - threshold) {
      y = -speed;
    }

    if (x !== 0 || y !== 0) {
      void this.store.panBy({ x, y }).then(() => this.applyViewportTransform(this.store.viewport));
    }
  }

  nodeComponentFor = (node: Node): NodeComponent | undefined => {
    let type = node.type;
    return type ? this.args.nodeTypes?.[type] : undefined;
  };

  nodePositionFor = (node: Node) => {
    return this.store.getNodePosition(node);
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
            {{#each this.edgeItems as |item|}}
              <FlowEdge
                @edge={{item.edge}}
                @source={{item.source}}
                @target={{item.target}}
              />
            {{/each}}
          </div>
          <div class='ember-flow__edge-labels ember-flow__container'></div>
          <div class='ember-flow__nodes'>
            {{#each this.nodes as |node|}}
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
        <svg class='ember-flow__connectionline ember-flow__container' style='display: none;'>
          <g class='ember-flow__connection'>
            <path class='ember-flow__connection-path' fill='none' />
          </g>
        </svg>
        <div class='ember-flow__selection'></div>
      </div>
      {{yield this.store}}
    </div>
  </template>
}

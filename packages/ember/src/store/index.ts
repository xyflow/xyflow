import { tracked } from '@glimmer/tracking';
import {
  clampPosition,
  infiniteExtent,
  adoptUserNodes,
  getInternalNodesBounds,
  getNodesBounds as getNodesBoundsSystem,
  getViewportForBounds,
  isCoordinateExtent,
  panBy as panBySystem,
  snapPosition,
  updateConnectionLookup,
  type CoordinateExtent,
  type ConnectionLookup,
  type EdgeLookup,
  type SetCenterOptions,
  type InternalNodeBase,
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

interface DeleteElementsOptions<NodeType extends Node, EdgeType extends Edge> {
  nodes: NodeType[];
  edges: EdgeType[];
  nodesDeletable: boolean;
}

interface DeleteElementsResult<NodeType extends Node, EdgeType extends Edge> {
  nodeChanges: NodeChange<NodeType>[];
  edgeChanges: EdgeChange<EdgeType>[];
}

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
  width = 0;
  height = 0;
  minZoom = 0.5;
  maxZoom = 2;
  snapToGrid = false;
  snapGrid: SnapGrid = [15, 15];

  @tracked nodesDraggable = true;
  @tracked nodesConnectable = true;
  @tracked elementsSelectable = true;

  readonly nodeLookup: NodeLookup<InternalNodeBase<NodeType>> = new Map();
  readonly parentLookup: ParentLookup<InternalNodeBase<NodeType>> = new Map();
  readonly edgeLookup: EdgeLookup<EdgeType> = new Map();
  readonly connectionLookup: ConnectionLookup = new Map();

  @tracked revision = 0;
  nodesInitialized = false;

  readonly selectedNodeIds = new Set<string>();
  readonly selectedEdgeIds = new Set<string>();
  readonly deletedNodeIds = new Set<string>();
  readonly deletedEdgeIds = new Set<string>();
  readonly pressedKeys = new Set<string>();
  readonly nodePositions = new Map<string, XYPosition>();
  readonly nodeDimensions = new Map<string, { width: number; height: number }>();
  private readonly viewportListeners = new Set<(viewport: Viewport) => void>();

  private addedEdges: EdgeType[] = [];
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
    return this.syncGraph(sourceNodes, this.currentSourceEdges).nodes;
  }

  getEdges(sourceEdges: EdgeType[] = this.currentSourceEdges): EdgeType[] {
    this.currentSourceEdges = sourceEdges;
    return this.syncGraph(this.currentSourceNodes, sourceEdges).edges;
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

  private materializeNodes(sourceNodes: NodeType[] = []): NodeType[] {
    return sourceNodes
      .filter((node) => !this.deletedNodeIds.has(node.id))
      .map((node) => {
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

  setViewport(viewport: Viewport) {
    this.viewport = this.normalizeViewport(viewport);
    this.notifyViewportListeners();
  }

  onViewportChange(callback: (viewport: Viewport) => void) {
    this.viewportListeners.add(callback);
    callback(this.viewport);

    return () => {
      this.viewportListeners.delete(callback);
    };
  }

  syncPanZoomViewport() {
    this.panZoom?.syncViewport(this.viewport);
  }

  addPressedKey(key: string) {
    this.pressedKeys.add(key);
  }

  removePressedKey(key: string) {
    this.pressedKeys.delete(key);
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
    this.addedEdges = [...this.addedEdges, edge];
    this.bump();
  }

  setNodePosition(id: string, position: XYPosition) {
    let rounded = {
      x: this.roundViewportValue(position.x),
      y: this.roundViewportValue(position.y),
    };

    this.nodePositions.set(id, rounded);

    return rounded;
  }

  setNodeAbsolutePosition(id: string, node: Node, absolutePosition: XYPosition) {
    let constrainedPosition = this.constrainNodeAbsolutePosition(node, absolutePosition);
    let userPosition = this.absoluteToUserPosition(node, constrainedPosition);

    return {
      position: this.setNodePosition(id, userPosition),
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
      }),
    );
  }

  private getNodeAbsoluteExtent(node: Node): CoordinateExtent | null {
    let parentPosition = this.getParentAbsolutePosition(node);

    if (node.extent === 'parent') {
      let parent = node.parentId ? this.currentSourceNodes.find((candidate) => candidate.id === node.parentId) : undefined;

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

    return rounded;
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
    this.width = width;
    this.height = height;
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
      },
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
      options?.padding ?? 0.1,
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

  private getFitViewNodes(options?: FitViewOptions<NodeType>) {
    let optionNodeIds = options?.nodes ? new Set(options.nodes.map((node) => node.id)) : null;

    return this.getNodes().filter((node) => {
      if (!options?.includeHiddenNodes && node.hidden) {
        return false;
      }

      return !optionNodeIds || optionNodeIds.has(node.id);
    });
  }

  screenToFlowPosition(clientPosition: XYPosition, domNode: HTMLElement | null) {
    if (!domNode) {
      return clientPosition;
    }

    let { x: domX, y: domY } = domNode.getBoundingClientRect();

    return pointToRendererPoint(
      {
        x: clientPosition.x - domX,
        y: clientPosition.y - domY,
      },
      [this.viewport.x, this.viewport.y, this.viewport.zoom]
    );
  }

  flowToScreenPosition(flowPosition: XYPosition, domNode: HTMLElement | null) {
    if (!domNode) {
      return flowPosition;
    }

    let { x: domX, y: domY } = domNode.getBoundingClientRect();
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
    this.addedEdges = [];
    this.panZoom = null;
    this.viewport = initialViewport ?? { x: 0, y: 0, zoom: 1 };
    this.notifyViewportListeners();
    this.bump();
  }

  bump() {
    this.revision++;
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

  private notifyViewportListeners() {
    for (let listener of this.viewportListeners) {
      listener(this.viewport);
    }
  }
}

export type { DeleteElementsOptions, DeleteElementsResult };

import { tracked } from '@glimmer/tracking';
import {
  infiniteExtent,
  adoptUserNodes,
  getInternalNodesBounds,
  getNodesBounds as getNodesBoundsSystem,
  updateConnectionLookup,
  type CoordinateExtent,
  type ConnectionLookup,
  type EdgeLookup,
  type InternalNodeBase,
  type NodeLookup,
  type NodeOrigin,
  type PanZoomInstance,
  type ParentLookup,
  type Rect,
  type Viewport,
  type XYPosition,
  type ZIndexMode,
  pointToRendererPoint,
  rendererPointToPoint,
} from '@xyflow/system';

import type { Edge, EdgeChange, Node, NodeChange } from '../types.js';

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
  translateExtent: CoordinateExtent = [
    [-Infinity, -Infinity],
    [Infinity, Infinity],
  ];
  nodeOrigin: NodeOrigin = [0, 0];
  nodeExtent: CoordinateExtent = infiniteExtent;
  zIndexMode: ZIndexMode = 'basic';
  elevateNodesOnSelect = true;

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
      .filter((node) => node.selected)
      .map((node) => node.internals.userNode);
  }

  get selectedEdges() {
    return Array.from(this.edgeLookup.values()).filter((edge) => edge.selected);
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
        let selected = this.selectedNodeIds.has(node.id) || node.selected;

        if (!position && selected === node.selected) {
          return node;
        }

        return {
          ...node,
          ...(position ? { position } : {}),
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

  getNodePosition(node: Node) {
    return this.nodePositions.get(node.id) ?? node.position;
  }

  getNodeWidth(node: Node) {
    return node.width ?? node.initialWidth ?? node.measured?.width ?? 150;
  }

  getNodeHeight(node: Node) {
    return node.height ?? node.initialHeight ?? node.measured?.height ?? 40;
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

  panBy(delta: XYPosition) {
    this.setViewport({
      x: this.viewport.x + delta.x,
      y: this.viewport.y + delta.y,
      zoom: this.viewport.zoom,
    });
    this.syncPanZoomViewport();
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
    this.addedEdges = [];
    this.panZoom = null;
    this.viewport = initialViewport ?? { x: 0, y: 0, zoom: 1 };
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
}

export type { DeleteElementsOptions, DeleteElementsResult };

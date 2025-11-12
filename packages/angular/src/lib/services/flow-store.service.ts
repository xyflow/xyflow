import { Injectable, signal, computed, effect, WritableSignal } from '@angular/core';
import {
  NodeBase,
  EdgeBase,
  Connection,
  Viewport,
  NodeChange,
  EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge as systemAddEdge,
  XYPosition,
  NodeLookup,
  EdgeLookup,
  getNodesBounds,
  fitView as systemFitView,
  PanZoomInstance,
  createNodeLookup,
  createEdgeLookup,
  infiniteExtent,
} from '@xyflow/system';
import type { AngularNode, AngularEdge, AngularFlowProps, AngularFlowInstance } from '../types';

/**
 * FlowStoreService manages the state of the flow diagram using Angular signals
 */
@Injectable()
export class FlowStoreService<
  NodeType extends AngularNode = AngularNode,
  EdgeType extends AngularEdge = AngularEdge
> {
  // Core state signals
  private _nodes = signal<NodeType[]>([]);
  private _edges = signal<EdgeType[]>([]);
  private _viewport = signal<Viewport>({ x: 0, y: 0, zoom: 1 });
  private _nodeLookup = signal<NodeLookup>(new Map());
  private _edgeLookup = signal<EdgeLookup>(new Map());
  private _width = signal<number>(0);
  private _height = signal<number>(0);
  private _minZoom = signal<number>(0.5);
  private _maxZoom = signal<number>(2);
  private _translateExtent = signal<[[number, number], [number, number]]>(infiniteExtent);
  private _nodeExtent = signal<[[number, number], [number, number]]>(infiniteExtent);
  private _connectionMode = signal<string>('strict');
  private _panZoom = signal<PanZoomInstance | null>(null);
  private _domNode = signal<HTMLElement | null>(null);
  private _initialized = signal<boolean>(false);

  // Selection state
  private _selectedNodeIds = signal<Set<string>>(new Set());
  private _selectedEdgeIds = signal<Set<string>>(new Set());

  // Connection state
  private _connectionStartHandle = signal<{ nodeId: string; handleId: string | null; type: string } | null>(null);
  private _connectionEndHandle = signal<{ nodeId: string; handleId: string | null; type: string } | null>(null);
  private _connectionPosition = signal<XYPosition>({ x: 0, y: 0 });

  // Public readonly signals
  public readonly nodes = this._nodes.asReadonly();
  public readonly edges = this._edges.asReadonly();
  public readonly viewport = this._viewport.asReadonly();
  public readonly nodeLookup = this._nodeLookup.asReadonly();
  public readonly edgeLookup = this._edgeLookup.asReadonly();
  public readonly width = this._width.asReadonly();
  public readonly height = this._height.asReadonly();
  public readonly minZoom = this._minZoom.asReadonly();
  public readonly maxZoom = this._maxZoom.asReadonly();
  public readonly initialized = this._initialized.asReadonly();
  public readonly selectedNodeIds = this._selectedNodeIds.asReadonly();
  public readonly selectedEdgeIds = this._selectedEdgeIds.asReadonly();
  public readonly connectionStartHandle = this._connectionStartHandle.asReadonly();
  public readonly connectionEndHandle = this._connectionEndHandle.asReadonly();
  public readonly connectionPosition = this._connectionPosition.asReadonly();

  // Computed signals
  public readonly selectedNodes = computed(() => {
    const nodes = this._nodes();
    const selectedIds = this._selectedNodeIds();
    return nodes.filter(node => selectedIds.has(node.id));
  });

  public readonly selectedEdges = computed(() => {
    const edges = this._edges();
    const selectedIds = this._selectedEdgeIds();
    return edges.filter(edge => selectedIds.has(edge.id));
  });

  public readonly isConnecting = computed(() => this._connectionStartHandle() !== null);

  constructor() {}

  /**
   * Initialize the store with props
   */
  public initialize(props: AngularFlowProps<NodeType, EdgeType>): void {
    if (props.nodes) {
      this.setNodes(props.nodes);
    }
    if (props.edges) {
      this.setEdges(props.edges);
    }
    if (props.defaultViewport) {
      this._viewport.set(props.defaultViewport);
    }
    if (props.minZoom !== undefined) {
      this._minZoom.set(props.minZoom);
    }
    if (props.maxZoom !== undefined) {
      this._maxZoom.set(props.maxZoom);
    }
    if (props.translateExtent) {
      this._translateExtent.set(props.translateExtent);
    }
    if (props.nodeExtent) {
      this._nodeExtent.set(props.nodeExtent);
    }
    if (props.connectionMode) {
      this._connectionMode.set(props.connectionMode);
    }
    this._initialized.set(true);
  }

  /**
   * Set nodes and update lookup
   */
  public setNodes(nodes: NodeType[]): void {
    this._nodes.set(nodes);
    this._nodeLookup.set(createNodeLookup(nodes as any));
    this.updateSelectionFromNodes();
  }

  /**
   * Set edges and update lookup
   */
  public setEdges(edges: EdgeType[]): void {
    this._edges.set(edges);
    this._edgeLookup.set(createEdgeLookup(edges as any));
    this.updateSelectionFromEdges();
  }

  /**
   * Apply node changes
   */
  public applyNodeChanges(changes: NodeChange[]): void {
    const currentNodes = this._nodes();
    const updatedNodes = applyNodeChanges(changes, currentNodes as any[]) as NodeType[];
    this.setNodes(updatedNodes);
  }

  /**
   * Apply edge changes
   */
  public applyEdgeChanges(changes: EdgeChange[]): void {
    const currentEdges = this._edges();
    const updatedEdges = applyEdgeChanges(changes, currentEdges as any[]) as EdgeType[];
    this.setEdges(updatedEdges);
  }

  /**
   * Add a new edge from a connection
   */
  public addEdge(connection: Connection): void {
    const currentEdges = this._edges();
    const newEdges = systemAddEdge(connection, currentEdges as any[]) as EdgeType[];
    this.setEdges(newEdges);
  }

  /**
   * Get a node by ID
   */
  public getNode(id: string): NodeType | undefined {
    return this._nodeLookup().get(id) as NodeType | undefined;
  }

  /**
   * Get an edge by ID
   */
  public getEdge(id: string): EdgeType | undefined {
    return this._edgeLookup().get(id) as EdgeType | undefined;
  }

  /**
   * Update a node
   */
  public updateNode(id: string, updates: Partial<NodeType>): void {
    const currentNodes = this._nodes();
    const updatedNodes = currentNodes.map(node =>
      node.id === id ? { ...node, ...updates } : node
    );
    this.setNodes(updatedNodes);
  }

  /**
   * Update an edge
   */
  public updateEdge(id: string, updates: Partial<EdgeType>): void {
    const currentEdges = this._edges();
    const updatedEdges = currentEdges.map(edge =>
      edge.id === id ? { ...edge, ...updates } : edge
    );
    this.setEdges(updatedEdges);
  }

  /**
   * Delete a node
   */
  public deleteNode(id: string): void {
    const currentNodes = this._nodes();
    const updatedNodes = currentNodes.filter(node => node.id !== id);
    this.setNodes(updatedNodes);
  }

  /**
   * Delete an edge
   */
  public deleteEdge(id: string): void {
    const currentEdges = this._edges();
    const updatedEdges = currentEdges.filter(edge => edge.id !== id);
    this.setEdges(updatedEdges);
  }

  /**
   * Add nodes
   */
  public addNodes(nodes: NodeType | NodeType[]): void {
    const nodesToAdd = Array.isArray(nodes) ? nodes : [nodes];
    const currentNodes = this._nodes();
    this.setNodes([...currentNodes, ...nodesToAdd]);
  }

  /**
   * Add edges
   */
  public addEdges(edges: EdgeType | EdgeType[]): void {
    const edgesToAdd = Array.isArray(edges) ? edges : [edges];
    const currentEdges = this._edges();
    this.setEdges([...currentEdges, ...edgesToAdd]);
  }

  /**
   * Set viewport
   */
  public setViewport(viewport: Viewport): void {
    this._viewport.set(viewport);
    const panZoom = this._panZoom();
    if (panZoom) {
      panZoom.setViewportConstrained(viewport, [
        [0, 0],
        [this._width(), this._height()]
      ]);
    }
  }

  /**
   * Get current viewport
   */
  public getViewport(): Viewport {
    return this._viewport();
  }

  /**
   * Set dimensions
   */
  public setDimensions(width: number, height: number): void {
    this._width.set(width);
    this._height.set(height);
  }

  /**
   * Set PanZoom instance
   */
  public setPanZoom(panZoom: PanZoomInstance): void {
    this._panZoom.set(panZoom);
  }

  /**
   * Set DOM node
   */
  public setDomNode(node: HTMLElement): void {
    this._domNode.set(node);
  }

  /**
   * Get DOM node
   */
  public getDomNode(): HTMLElement | null {
    return this._domNode();
  }

  /**
   * Start a connection
   */
  public startConnection(nodeId: string, handleId: string | null, type: string): void {
    this._connectionStartHandle.set({ nodeId, handleId, type });
  }

  /**
   * End connection
   */
  public endConnection(): void {
    this._connectionStartHandle.set(null);
    this._connectionEndHandle.set(null);
  }

  /**
   * Update connection position
   */
  public updateConnectionPosition(position: XYPosition): void {
    this._connectionPosition.set(position);
  }

  /**
   * Update selection from nodes
   */
  private updateSelectionFromNodes(): void {
    const nodes = this._nodes();
    const selected = new Set<string>();
    nodes.forEach(node => {
      if (node.selected) {
        selected.add(node.id);
      }
    });
    this._selectedNodeIds.set(selected);
  }

  /**
   * Update selection from edges
   */
  private updateSelectionFromEdges(): void {
    const edges = this._edges();
    const selected = new Set<string>();
    edges.forEach(edge => {
      if (edge.selected) {
        selected.add(edge.id);
      }
    });
    this._selectedEdgeIds.set(selected);
  }

  /**
   * Select node
   */
  public selectNode(id: string, exclusive: boolean = true): void {
    if (exclusive) {
      const updatedNodes = this._nodes().map(node => ({
        ...node,
        selected: node.id === id
      }));
      this.setNodes(updatedNodes);
    } else {
      this.updateNode(id, { selected: true } as Partial<NodeType>);
    }
  }

  /**
   * Deselect node
   */
  public deselectNode(id: string): void {
    this.updateNode(id, { selected: false } as Partial<NodeType>);
  }

  /**
   * Select edge
   */
  public selectEdge(id: string, exclusive: boolean = true): void {
    if (exclusive) {
      const updatedEdges = this._edges().map(edge => ({
        ...edge,
        selected: edge.id === id
      }));
      this.setEdges(updatedEdges);
    } else {
      this.updateEdge(id, { selected: true } as Partial<EdgeType>);
    }
  }

  /**
   * Deselect edge
   */
  public deselectEdge(id: string): void {
    this.updateEdge(id, { selected: false } as Partial<EdgeType>);
  }

  /**
   * Clear all selections
   */
  public clearSelection(): void {
    const updatedNodes = this._nodes().map(node => ({ ...node, selected: false }));
    const updatedEdges = this._edges().map(edge => ({ ...edge, selected: false }));
    this.setNodes(updatedNodes);
    this.setEdges(updatedEdges);
  }

  /**
   * Reset store
   */
  public reset(): void {
    this._nodes.set([]);
    this._edges.set([]);
    this._viewport.set({ x: 0, y: 0, zoom: 1 });
    this._nodeLookup.set(new Map());
    this._edgeLookup.set(new Map());
    this._selectedNodeIds.set(new Set());
    this._selectedEdgeIds.set(new Set());
    this._connectionStartHandle.set(null);
    this._connectionEndHandle.set(null);
    this._initialized.set(false);
  }
}

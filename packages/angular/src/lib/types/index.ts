// Re-export all types from @xyflow/system
export * from '@xyflow/system';

// Angular-specific types
import { TemplateRef, Type } from '@angular/core';
import type {
  NodeBase,
  EdgeBase,
  Connection,
  Viewport,
  NodeChange,
  EdgeChange,
  CoordinateExtent,
  FitViewOptions,
  OnConnect,
  OnConnectStart,
  OnConnectEnd,
  OnMove,
  OnMoveStart,
  OnMoveEnd,
  OnNodeDrag,
  OnSelectionDrag,
  OnBeforeDelete,
  PanOnScrollMode,
  OnError,
  SelectionMode,
  ConnectionMode,
  FitBoundsOptions,
} from '@xyflow/system';

/**
 * Angular node type with component reference
 */
export interface AngularNode<
  NodeData extends Record<string, unknown> = Record<string, unknown>,
  NodeType extends string = string
> extends NodeBase<NodeData, NodeType> {
  component?: Type<any> | TemplateRef<any>;
}

/**
 * Angular edge type with component reference
 */
export interface AngularEdge<
  EdgeData extends Record<string, unknown> = Record<string, unknown>,
  EdgeType extends string = string
> extends EdgeBase<EdgeData, EdgeType> {
  component?: Type<any> | TemplateRef<any>;
}

/**
 * Node types mapping for custom node components
 */
export interface NodeTypes {
  [key: string]: Type<any> | TemplateRef<any>;
}

/**
 * Edge types mapping for custom edge components
 */
export interface EdgeTypes {
  [key: string]: Type<any> | TemplateRef<any>;
}

/**
 * Props passed to custom node components
 */
export interface NodeComponentProps<
  NodeData extends Record<string, unknown> = Record<string, unknown>
> {
  id: string;
  data: NodeData;
  selected: boolean;
  dragging: boolean;
  width?: number;
  height?: number;
  zIndex: number;
}

/**
 * Props passed to custom edge components
 */
export interface EdgeComponentProps<
  EdgeData extends Record<string, unknown> = Record<string, unknown>
> {
  id: string;
  data?: EdgeData;
  selected: boolean;
  source: string;
  target: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  sourcePosition: string;
  targetPosition: string;
  markerStart?: string;
  markerEnd?: string;
}

/**
 * Main AngularFlow component props
 */
export interface AngularFlowProps<
  NodeType extends AngularNode = AngularNode,
  EdgeType extends AngularEdge = AngularEdge
> {
  nodes?: NodeType[];
  edges?: EdgeType[];
  nodeTypes?: NodeTypes;
  edgeTypes?: EdgeTypes;
  defaultViewport?: Viewport;
  minZoom?: number;
  maxZoom?: number;
  translateExtent?: CoordinateExtent;
  nodeExtent?: CoordinateExtent;
  defaultEdgeOptions?: Partial<EdgeType>;
  connectionMode?: ConnectionMode;
  connectionLineType?: string;
  fitView?: boolean;
  fitViewOptions?: FitViewOptions;
  elevateNodesOnSelect?: boolean;
  elevateEdgesOnSelect?: boolean;
  selectNodesOnDrag?: boolean;
  panOnDrag?: boolean | number[];
  panOnScroll?: boolean;
  panOnScrollSpeed?: number;
  panOnScrollMode?: PanOnScrollMode;
  zoomOnScroll?: boolean;
  zoomOnPinch?: boolean;
  zoomOnDoubleClick?: boolean;
  preventScrolling?: boolean;
  selectionOnDrag?: boolean;
  selectionMode?: SelectionMode;
  multiSelectionKeyCode?: string | string[] | null;
  deleteKeyCode?: string | string[] | null;
  panActivationKeyCode?: string | string[] | null;
  zoomActivationKeyCode?: string | string[] | null;
  snapToGrid?: boolean;
  snapGrid?: [number, number];
  onlyRenderVisibleElements?: boolean;
  attributionPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  proOptions?: { hideAttribution?: boolean };

  // Event handlers
  onNodesChange?: (changes: NodeChange[]) => void;
  onEdgesChange?: (changes: EdgeChange[]) => void;
  onConnect?: OnConnect;
  onConnectStart?: OnConnectStart;
  onConnectEnd?: OnConnectEnd;
  onNodeClick?: (event: MouseEvent, node: NodeType) => void;
  onNodeDoubleClick?: (event: MouseEvent, node: NodeType) => void;
  onNodeMouseEnter?: (event: MouseEvent, node: NodeType) => void;
  onNodeMouseMove?: (event: MouseEvent, node: NodeType) => void;
  onNodeMouseLeave?: (event: MouseEvent, node: NodeType) => void;
  onNodeDrag?: OnNodeDrag<NodeType>;
  onNodeDragStart?: OnNodeDrag<NodeType>;
  onNodeDragStop?: OnNodeDrag<NodeType>;
  onSelectionDragStart?: OnSelectionDrag;
  onSelectionDrag?: OnSelectionDrag;
  onSelectionDragStop?: OnSelectionDrag;
  onEdgeClick?: (event: MouseEvent, edge: EdgeType) => void;
  onEdgeDoubleClick?: (event: MouseEvent, edge: EdgeType) => void;
  onEdgeMouseEnter?: (event: MouseEvent, edge: EdgeType) => void;
  onEdgeMouseMove?: (event: MouseEvent, edge: EdgeType) => void;
  onEdgeMouseLeave?: (event: MouseEvent, edge: EdgeType) => void;
  onMove?: OnMove;
  onMoveStart?: OnMoveStart;
  onMoveEnd?: OnMoveEnd;
  onInit?: (instance: AngularFlowInstance) => void;
  onBeforeDelete?: OnBeforeDelete;
  onError?: OnError;
  onPaneClick?: (event: MouseEvent) => void;
  onPaneScroll?: (event: WheelEvent) => void;
  onPaneContextMenu?: (event: MouseEvent) => void;
}

/**
 * AngularFlow instance methods
 */
export interface AngularFlowInstance<
  NodeType extends AngularNode = AngularNode,
  EdgeType extends AngularEdge = AngularEdge
> {
  // Viewport methods
  zoomIn: (options?: { duration?: number }) => Promise<boolean>;
  zoomOut: (options?: { duration?: number }) => Promise<boolean>;
  zoomTo: (zoom: number, options?: { duration?: number }) => Promise<boolean>;
  setViewport: (viewport: Viewport, options?: { duration?: number }) => Promise<boolean>;
  getViewport: () => Viewport;
  fitView: (options?: FitViewOptions) => Promise<boolean>;
  fitBounds: (bounds: any, options?: FitBoundsOptions) => Promise<boolean>;
  setCenter: (x: number, y: number, options?: { zoom?: number; duration?: number }) => Promise<boolean>;

  // Node methods
  getNode: (id: string) => NodeType | undefined;
  getNodes: () => NodeType[];
  setNodes: (nodes: NodeType[]) => void;
  addNodes: (nodes: NodeType | NodeType[]) => void;
  updateNode: (id: string, updates: Partial<NodeType>) => void;
  deleteNode: (id: string) => void;

  // Edge methods
  getEdge: (id: string) => EdgeType | undefined;
  getEdges: () => EdgeType[];
  setEdges: (edges: EdgeType[]) => void;
  addEdges: (edges: EdgeType | EdgeType[]) => void;
  updateEdge: (id: string, updates: Partial<EdgeType>) => void;
  deleteEdge: (id: string) => void;

  // Utility methods
  screenToFlowPosition: (position: { x: number; y: number }) => { x: number; y: number };
  flowToScreenPosition: (position: { x: number; y: number }) => { x: number; y: number };
  getIntersectingNodes: (node: NodeType | { id: string }, partially?: boolean) => NodeType[];
  isNodeIntersecting: (node: NodeType | { id: string }, area: any, partially?: boolean) => boolean;
}

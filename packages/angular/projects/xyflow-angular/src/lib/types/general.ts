// Re-export types from @xyflow/system
export type {
  // Core node and edge types
  NodeBase as Node,
  EdgeBase as Edge,
  InternalNodeBase,
  Connection,
  Viewport,
  Transform,
  XYPosition,
  Position,
  NodeOrigin,
  CoordinateExtent,
  ConnectionState,
  NodeChange,
  EdgeChange,
  OnConnect,
  OnConnectStart,
  OnConnectEnd,
  OnError,
  IsValidConnection,
  OnReconnect as OnBeforeConnect,
  FitViewOptionsBase as FitViewOptions,
  ViewportHelperFunctionOptions,
  SetCenterOptions,
  HandleType,
  HandleConnection,
  NodeConnection,
  PanelPosition,
  ColorMode,
  ProOptions,
  SelectionMode,
  PanOnScrollMode
} from '@xyflow/system';

// Import types for internal use
import type {
  NodeBase,
  EdgeBase,
  XYPosition,
  CoordinateExtent,
  Viewport,
  ConnectionState,
  Transform,
  NodeOrigin,
  OnConnect,
  OnConnectStart,
  OnConnectEnd,
  OnError,
  IsValidConnection,
  OnReconnect,
  NodeChange,
  EdgeChange,
  FitViewOptionsBase,
  ColorMode,
  ProOptions,
  PanelPosition
} from '@xyflow/system';

import type { Type, TemplateRef } from '@angular/core';

// Angular-specific node and edge interfaces
export interface AngularFlowNode extends NodeBase {
  position: XYPosition;
  data: Record<string, unknown>;
  id: string;
  // Angular-specific properties
  component?: string;
  componentInputs?: Record<string, unknown>;
  parentNode?: string;
  extent?: 'parent' | CoordinateExtent;
}

export interface AngularFlowEdge extends EdgeBase {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
  type?: string;
  data?: Record<string, unknown>;
  selected?: boolean;
  animated?: boolean;
  hidden?: boolean;
  deletable?: boolean;
  style?: Partial<CSSStyleDeclaration>;
  className?: string;
  label?: string | number;
  labelStyle?: Partial<CSSStyleDeclaration>;
  labelShowBg?: boolean;
  labelBgStyle?: Partial<CSSStyleDeclaration>;
  labelBgPadding?: [number, number];
  labelBgBorderRadius?: number;
  labelComponent?: Type<unknown> | TemplateRef<unknown>;
  markerStart?: string;
  markerEnd?: string;
  zIndex?: number;
}

// Angular-specific NodeTypes and EdgeTypes
export interface AngularNodeTypes {
  [key: string]: Type<unknown> | TemplateRef<unknown>;
}

export interface AngularEdgeTypes {
  [key: string]: Type<unknown> | TemplateRef<unknown>;
}

// Angular-specific types
export interface AngularFlowState {
  nodes: AngularFlowNode[];
  edges: AngularFlowEdge[];
  viewport: Viewport;
  nodeTypes: AngularNodeTypes;
  edgeTypes: AngularEdgeTypes;
  connection: ConnectionState;
  transform: Transform;
  width: number;
  height: number;
  minZoom: number;
  maxZoom: number;
  nodeOrigin: NodeOrigin;
  nodeExtent: CoordinateExtent;
  translateExtent: CoordinateExtent;
  elementsSelectable: boolean;
  nodesDraggable: boolean;
  nodesConnectable: boolean;
}

export interface UnselectNodesAndEdgesParams {
  nodes?: AngularFlowNode[];
  edges?: AngularFlowEdge[];
}

export interface FlowStateConfig {
  nodes?: AngularFlowNode[];
  edges?: AngularFlowEdge[];
  nodeTypes?: AngularNodeTypes;
  edgeTypes?: AngularEdgeTypes;
  onConnect?: OnConnect;
  onConnectStart?: OnConnectStart;
  onConnectEnd?: OnConnectEnd;
  onError?: OnError;
  isValidConnection?: IsValidConnection;
  onBeforeConnect?: OnReconnect;
  minZoom?: number;
  maxZoom?: number;
  nodeOrigin?: NodeOrigin;
  nodeExtent?: CoordinateExtent;
  translateExtent?: CoordinateExtent;
  elementsSelectable?: boolean;
  nodesDraggable?: boolean;
  nodesConnectable?: boolean;
}

// Component prop types
export interface AngularFlowProps<NodeType extends AngularFlowNode = AngularFlowNode, EdgeType extends AngularFlowEdge = AngularFlowEdge> {
  nodes?: NodeType[];
  edges?: EdgeType[];
  nodeTypes?: AngularNodeTypes;
  edgeTypes?: AngularEdgeTypes;
  onNodesChange?: (changes: NodeChange[]) => void;
  onEdgesChange?: (changes: EdgeChange[]) => void;
  onConnect?: OnConnect;
  onConnectStart?: OnConnectStart;
  onConnectEnd?: OnConnectEnd;
  onNodeClick?: (event: MouseEvent, node: NodeType) => void;
  onNodeDoubleClick?: (event: MouseEvent, node: NodeType) => void;
  onNodeMouseEnter?: (event: MouseEvent, node: NodeType) => void;
  onNodeMouseLeave?: (event: MouseEvent, node: NodeType) => void;
  onNodeContextMenu?: (event: MouseEvent, node: NodeType) => void;
  onEdgeClick?: (event: MouseEvent, edge: EdgeType) => void;
  onEdgeDoubleClick?: (event: MouseEvent, edge: EdgeType) => void;
  onEdgeMouseEnter?: (event: MouseEvent, edge: EdgeType) => void;
  onEdgeMouseLeave?: (event: MouseEvent, edge: EdgeType) => void;
  onEdgeContextMenu?: (event: MouseEvent, edge: EdgeType) => void;
  onPaneClick?: (event: MouseEvent) => void;
  onPaneContextMenu?: (event: MouseEvent) => void;
  onViewportChange?: (viewport: Viewport) => void;
  onError?: OnError;
  isValidConnection?: IsValidConnection;
  onBeforeConnect?: OnReconnect;
  viewport?: Viewport;
  minZoom?: number;
  maxZoom?: number;
  nodeOrigin?: NodeOrigin;
  nodeExtent?: CoordinateExtent;
  translateExtent?: CoordinateExtent;
  elementsSelectable?: boolean;
  nodesDraggable?: boolean;
  nodesConnectable?: boolean;
  fitView?: boolean;
  fitViewOptions?: FitViewOptionsBase;
  colorMode?: ColorMode;
  proOptions?: ProOptions;
  width?: number;
  height?: number;
}

// Node and Edge component props
export interface NodeProps<T = Record<string, unknown>> {
  id: string;
  data: T;
  selected: boolean;
  type: string;
  xPos: number;
  yPos: number;
  dragging: boolean;
  width?: number;
  height?: number;
}

export interface EdgeProps<T = Record<string, unknown>> {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
  data?: T;
  selected: boolean;
  type: string;
  animated?: boolean;
  style?: CSSStyleDeclaration;
  markerStart?: string;
  markerEnd?: string;
}

// Control component props
export interface ControlsProps {
  position?: PanelPosition;
  orientation?: 'horizontal' | 'vertical';
  showZoom?: boolean;
  showFitView?: boolean;
  showInteractive?: boolean;
  fitViewOptions?: FitViewOptionsBase;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onFitView?: () => void;
  onInteractiveChange?: (interactive: boolean) => void;
  style?: Partial<CSSStyleDeclaration>;
  className?: string;
}

// Panel component props
export interface PanelProps {
  position?: PanelPosition;
  style?: Partial<CSSStyleDeclaration>;
  className?: string;
}

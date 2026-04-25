import type {
  Align,
  BezierPathOptions,
  DefaultEdgeOptionsBase,
  EdgeBase,
  EdgeChange as SystemEdgeChange,
  EdgePosition,
  EdgeToolbarBaseProps,
  InternalNodeBase,
  FitViewOptionsBase,
  HandleType,
  HandleProps as SystemHandleProps,
  ConnectionState,
  NodeBase,
  NodeChange as SystemNodeChange,
  NodeProps as SystemNodeProps,
  IsValidConnection,
  ConnectionLineType,
  OnConnectEnd,
  OnConnectStart,
  OnReconnect,
  OnReconnectEnd,
  OnReconnectStart,
  OnSelectionDrag,
  OnResize,
  OnResizeEnd,
  OnResizeStart,
  PanOnScrollMode,
  PanelPosition,
  Position,
  ResizeControlDirection,
  ResizeControlVariant,
  ShouldResize,
  SmoothStepPathOptions,
  StepPathOptions,
  ControlPosition,
  CoordinateExtent,
  ConnectionMode,
  HandleConnection,
  NodeOrigin,
  NodeConnection,
  SelectionMode,
  SnapGrid,
  Viewport,
  XYPosition,
  OnBeforeDeleteBase,
  OnViewportChange,
  ZIndexMode,
} from '@xyflow/system';

import type EmberFlowStore from './store/index.js';

export type CssStyle = string | Record<string, string | number | undefined>;

export type InternalNode<NodeType extends Node = Node> = InternalNodeBase<NodeType>;

export type EmberFlowJsonObject<NodeType extends Node = Node, EdgeType extends Edge = Edge> = {
  nodes: NodeType[];
  edges: EdgeType[];
  viewport: Viewport;
};

export type Node<
  NodeData extends Record<string, unknown> = Record<string, unknown>,
  NodeType extends string | undefined = string | undefined,
> = NodeBase<NodeData, NodeType> & {
  class?: string;
  className?: string;
  style?: CssStyle;
  focusable?: boolean;
  ariaRole?: string;
  resizing?: boolean;
};

export type Edge<
  EdgeData extends Record<string, unknown> = Record<string, unknown>,
  EdgeType extends string | undefined = string | undefined,
> = EdgeBase<EdgeData, EdgeType> & {
  label?: string | number;
  labelStyle?: CssStyle;
  labelShowBg?: boolean;
  labelBgStyle?: CssStyle;
  labelBgPadding?: [number, number];
  labelBgBorderRadius?: number;
  pathOptions?: BezierPathOptions & SmoothStepPathOptions & StepPathOptions;
  class?: string;
  className?: string;
  style?: CssStyle;
  reconnectable?: boolean | HandleType;
  focusable?: boolean;
  ariaRole?: string;
};

export type DefaultEdgeOptions<EdgeType extends Edge = Edge> = DefaultEdgeOptionsBase<EdgeType>;

export type BuiltInEdge =
  | (Edge<Record<string, unknown>, 'default'> & { pathOptions?: BezierPathOptions })
  | Edge<Record<string, unknown>, 'straight'>
  | Edge<Record<string, unknown>, 'simplebezier'>
  | (Edge<Record<string, unknown>, 'step'> & { pathOptions?: StepPathOptions })
  | (Edge<Record<string, unknown>, 'smoothstep'> & { pathOptions?: SmoothStepPathOptions });

export type BuiltInNode =
  | Node<{ label: string }, 'input' | 'output' | 'default' | undefined>
  | Node<Record<string, never>, 'group'>;

export type NodeProps<NodeType extends Node = Node> = Partial<SystemNodeProps<NodeType>> &
  Pick<SystemNodeProps<NodeType>, 'id' | 'data'> & {
    node: NodeType;
    type?: NodeType['type'];
    data: NodeType['data'];
    positionAbsoluteX: number;
    positionAbsoluteY: number;
    isConnectable: boolean;
  };

export type NodeComponentArgs<NodeType extends Node = Node> = NodeProps<NodeType>;
export type CustomNodeProps<NodeType extends Node = Node> = NodeProps<NodeType>;
export type NodeComponent = unknown;
export type NodeTypes<NodeType extends Node = Node> = Record<string, NodeComponent> & {
  readonly __nodeType?: NodeType;
};

export type EdgeProps<EdgeType extends Edge = Edge> = Omit<EdgeType, 'sourceHandle' | 'targetHandle'> &
  EdgePosition & {
    edge: EdgeType;
    type?: string;
    data?: EdgeType['data'];
    path?: string;
    labelX?: number;
    labelY?: number;
    markerStart?: string;
    markerEnd?: string;
    sourceHandleId?: string | null;
    targetHandleId?: string | null;
  };

export type CustomEdgeProps<EdgeType extends Edge = Edge> = EdgeProps<EdgeType>;
export type EdgeComponent = unknown;
export type EdgeTypes<EdgeType extends Edge = Edge> = Record<string, EdgeComponent> & {
  readonly __edgeType?: EdgeType;
};
export type MiniMapNodeComponent = unknown;
export type ConnectionLineComponent = unknown;

export type EdgeComponentProps = EdgePosition & {
  id?: string;
  hidden?: boolean;
  deletable?: boolean;
  selectable?: boolean;
  markerStart?: string;
  markerEnd?: string;
  zIndex?: number;
  ariaLabel?: string;
  interactionWidth?: number;
  label?: string | number;
  labelStyle?: CssStyle;
  labelShowBg?: boolean;
  labelBgStyle?: CssStyle;
  labelBgPadding?: [number, number];
  labelBgBorderRadius?: number;
  style?: CssStyle;
  className?: string;
};

export type BezierEdgeProps = EdgeComponentProps & {
  pathOptions?: BezierPathOptions;
};

export type SimpleBezierEdgeProps = EdgeComponentProps;

export type SmoothStepEdgeProps = EdgeComponentProps & {
  pathOptions?: SmoothStepPathOptions;
};

export type StepEdgeProps = EdgeComponentProps & {
  pathOptions?: StepPathOptions;
};

export type StraightEdgeProps = Omit<EdgeComponentProps, 'sourcePosition' | 'targetPosition'>;

export type FitViewOptions<NodeType extends Node = Node> = FitViewOptionsBase<NodeType>;

export type NodeChange<NodeType extends Node = Node> = SystemNodeChange<NodeType>;

export type EdgeChange<EdgeType extends Edge = Edge> = SystemEdgeChange<EdgeType>;

export type HandleProps = Partial<SystemHandleProps> & {
  node?: Node;
  nodeId?: string;
  className?: string;
  class?: string;
  style?: CssStyle;
};

export type Connection = {
  source: string;
  target: string;
  sourceHandle: string | null;
  targetHandle: string | null;
};

export type ConnectionLineComponentProps<NodeType extends Node = Node> = {
  connectionState: ConnectionState<InternalNode<NodeType>>;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  fromPosition: Position;
  toPosition: Position;
  fromNodeId: string;
  fromHandleId: string | null;
  fromHandleType: HandleType;
  isValid: boolean | null;
};

export type OnInit<NodeType extends Node = Node, EdgeType extends Edge = Edge> = (
  store: EmberFlowStore<NodeType, EdgeType>
) => void;

export type OnNodesDelete<NodeType extends Node = Node> = (nodes: NodeType[]) => void;

export type OnEdgesDelete<EdgeType extends Edge = Edge> = (edges: EdgeType[]) => void;

export type OnDelete<NodeType extends Node = Node, EdgeType extends Edge = Edge> = (params: {
  nodes: NodeType[];
  edges: EdgeType[];
}) => void;

export type OnBeforeDelete<NodeType extends Node = Node, EdgeType extends Edge = Edge> = OnBeforeDeleteBase<
  NodeType,
  EdgeType
>;

export type SelectionDragHandler<NodeType extends Node = Node> = OnSelectionDrag extends (
  event: infer EventType,
  nodes: infer _NodesType
) => void
  ? (event: EventType, nodes: NodeType[]) => void
  : (event: MouseEvent, nodes: NodeType[]) => void;

export interface EmberFlowArgs<NodeType extends Node = Node, EdgeType extends Edge = Edge> {
  store?: EmberFlowStore<NodeType, EdgeType>;
  nodes?: NodeType[];
  edges?: EdgeType[];
  defaultNodes?: NodeType[];
  defaultEdges?: EdgeType[];
  nodeTypes?: NodeTypes<NodeType>;
  edgeTypes?: EdgeTypes<EdgeType>;
  width?: number | string;
  height?: number | string;
  colorMode?: 'light' | 'dark' | 'system';
  fitView?: boolean;
  fitViewOptions?: FitViewOptions<NodeType>;
  initialViewport?: Viewport;
  viewport?: Viewport;
  minZoom?: number;
  maxZoom?: number;
  panOnScroll?: boolean;
  panOnScrollMode?: PanOnScrollMode;
  panOnScrollSpeed?: number;
  zoomOnScroll?: boolean;
  zoomOnPinch?: boolean;
  zoomOnDoubleClick?: boolean;
  panOnDrag?: boolean | number[];
  preventScrolling?: boolean;
  snapToGrid?: boolean;
  snapGrid?: SnapGrid;
  nodeOrigin?: NodeOrigin;
  nodeExtent?: CoordinateExtent;
  translateExtent?: CoordinateExtent;
  nodesDraggable?: boolean;
  nodesConnectable?: boolean;
  nodesFocusable?: boolean;
  edgesFocusable?: boolean;
  elevateNodesOnSelect?: boolean;
  zIndexMode?: ZIndexMode;
  nodesDeletable?: boolean;
  elementsSelectable?: boolean;
  disableKeyboardA11y?: boolean;
  selectNodesOnDrag?: boolean;
  nodeDragThreshold?: number;
  autoPanOnNodeDrag?: boolean;
  autoPanOnConnect?: boolean;
  autoPanSpeed?: number;
  connectionMode?: ConnectionMode;
  connectionRadius?: number;
  connectionDragThreshold?: number;
  connectionLineType?: ConnectionLineType;
  connectionLineStyle?: CssStyle;
  connectionLineContainerStyle?: CssStyle;
  connectionLineComponent?: ConnectionLineComponent;
  defaultMarkerColor?: string;
  defaultEdgeOptions?: DefaultEdgeOptions<EdgeType>;
  paneClickDistance?: number;
  selectionKey?: string | string[] | null;
  selectionKeyCode?: string | string[] | null;
  selectionOnDrag?: boolean;
  selectionMode?: SelectionMode;
  onlyRenderVisibleElements?: boolean;
  edgesReconnectable?: boolean;
  reconnectRadius?: number;
  deleteKey?: string;
  deleteKeyCode?: string | string[] | null;
  multiSelectionKey?: string | string[] | null;
  multiSelectionKeyCode?: string | string[] | null;
  zoomActivationKeyCode?: string | string[] | null;
  ariaLabelConfig?: unknown;
  autoPanOnNodeFocus?: boolean;
  onInit?: OnInit<NodeType, EdgeType>;
  onMoveStart?: (event: MouseEvent | TouchEvent | null, viewport: Viewport) => void;
  onMove?: (event: MouseEvent | TouchEvent | null, viewport: Viewport) => void;
  onMoveEnd?: (event: MouseEvent | TouchEvent | null, viewport: Viewport) => void;
  onViewportChangeStart?: OnViewportChange;
  onViewportChange?: OnViewportChange;
  onViewportChangeEnd?: OnViewportChange;
  onNodesChange?: (changes: NodeChange<NodeType>[]) => void;
  onEdgesChange?: (changes: EdgeChange<EdgeType>[]) => void;
  onBeforeDelete?: OnBeforeDelete<NodeType, EdgeType>;
  onNodesDelete?: OnNodesDelete<NodeType>;
  onEdgesDelete?: OnEdgesDelete<EdgeType>;
  onDelete?: OnDelete<NodeType, EdgeType>;
  onConnectStart?: OnConnectStart;
  onConnect?: (connection: Connection) => void;
  onConnectEnd?: OnConnectEnd;
  isValidConnection?: IsValidConnection;
  onReconnect?: OnReconnect<EdgeType>;
  onReconnectStart?: OnReconnectStart<EdgeType>;
  onReconnectEnd?: OnReconnectEnd<EdgeType>;
  onNodeClick?: (event: MouseEvent, node: NodeType) => void;
  onNodeDoubleClick?: (event: MouseEvent, node: NodeType) => void;
  onNodeContextMenu?: (event: MouseEvent, node: NodeType) => void;
  onEdgeClick?: (event: MouseEvent, edge: EdgeType) => void;
  onEdgeDoubleClick?: (event: MouseEvent, edge: EdgeType) => void;
  onEdgeContextMenu?: (event: MouseEvent, edge: EdgeType) => void;
  onEdgeMouseEnter?: (event: MouseEvent, edge: EdgeType) => void;
  onEdgeMouseMove?: (event: MouseEvent, edge: EdgeType) => void;
  onEdgeMouseLeave?: (event: MouseEvent, edge: EdgeType) => void;
  onPaneClick?: (event: MouseEvent) => void;
  onPaneMouseEnter?: (event: MouseEvent) => void;
  onPaneMouseMove?: (event: MouseEvent) => void;
  onPaneMouseLeave?: (event: MouseEvent) => void;
  onPaneScroll?: (event: WheelEvent) => void;
  onPaneContextMenu?: (event: MouseEvent) => void;
  onSelectionContextMenu?: (event: MouseEvent, nodes: NodeType[]) => void;
  onNodeDragStart?: (event: PointerEvent, node: NodeType) => void;
  onNodeDrag?: (event: PointerEvent, node: NodeType) => void;
  onNodeDragStop?: (event: PointerEvent, node: NodeType) => void;
  onSelectionDragStart?: SelectionDragHandler<NodeType>;
  onSelectionDrag?: SelectionDragHandler<NodeType>;
  onSelectionDragStop?: SelectionDragHandler<NodeType>;
  onSelectionStart?: (event: PointerEvent) => void;
  onSelectionEnd?: (event: PointerEvent) => void;
  onSelectionChange?: (selection: { nodes: NodeType[]; edges: EdgeType[] }) => void;
}

export interface PanelArgs {
  position?: PanelPosition;
}

export type PanelProps = PanelArgs;

export enum BackgroundVariant {
  Lines = 'lines',
  Dots = 'dots',
  Cross = 'cross',
}

export interface BackgroundArgs {
  id?: string;
  color?: string;
  bgColor?: string;
  patternColor?: string;
  patternClass?: string;
  patternClassName?: string;
  gap?: number | [number, number];
  offset?: number | [number, number];
  lineWidth?: number;
  size?: number;
  variant?: BackgroundVariant | 'lines' | 'dots' | 'cross';
}

export type BackgroundProps = BackgroundArgs;

export interface ControlsArgs {
  position?: PanelPosition;
  orientation?: 'horizontal' | 'vertical';
  showZoom?: boolean;
  showFitView?: boolean;
  showInteractive?: boolean;
  showLock?: boolean;
  fitViewOptions?: FitViewOptions;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onFitView?: () => void;
  onInteractiveChange?: (interactive: boolean) => void;
}

export type ControlsProps = ControlsArgs;

export interface ControlButtonArgs {
  className?: string;
  class?: string;
  disabled?: boolean;
  title?: string;
  ariaLabel?: string;
  style?: CssStyle;
}

export type ControlButtonProps = ControlButtonArgs;

export interface UseEmberFlowArgs {}

export type UseEmberFlowProps = UseEmberFlowArgs;

export interface UseNodesArgs {}

export type UseNodesProps = UseNodesArgs;

export interface UseEdgesArgs {}

export type UseEdgesProps = UseEdgesArgs;

export interface UseViewportArgs {}

export type UseViewportProps = UseViewportArgs;

export interface UseNodeIdArgs {}

export type UseNodeIdProps = UseNodeIdArgs;

export interface UseNodesDataArgs {
  nodeId?: string;
  nodeIds?: string | string[];
}

export type UseNodesDataProps = UseNodesDataArgs;

export type NodeDataSnapshot<NodeType extends Node = Node> = Pick<NodeType, 'id' | 'type' | 'data'>;

export interface UseHandleConnectionsArgs {
  type: HandleType;
  id?: string | null;
  nodeId?: string;
}

export type UseHandleConnectionsProps = UseHandleConnectionsArgs;

export interface UseNodeConnectionsArgs {
  id?: string;
  nodeId?: string;
  handleType?: HandleType;
  handleId?: string | null;
}

export type UseNodeConnectionsProps = UseNodeConnectionsArgs;

export type HandleConnections = HandleConnection[];

export type NodeConnections = NodeConnection[];

export interface UseConnectionArgs {}

export type UseConnectionProps = UseConnectionArgs;

export interface UseInternalNodeArgs {
  id?: string;
  nodeId?: string;
}

export type UseInternalNodeProps = UseInternalNodeArgs;

export interface UseNodesInitializedArgs {}

export type UseNodesInitializedProps = UseNodesInitializedArgs;

export interface UseKeyPressArgs {
  key?: string | string[] | null;
}

export type UseKeyPressProps = UseKeyPressArgs;

export interface UseStoreArgs<Selected = unknown, NodeType extends Node = Node, EdgeType extends Edge = Edge> {
  selector?: (store: EmberFlowStore<NodeType, EdgeType>) => Selected;
}

export type UseStoreProps<
  Selected = unknown,
  NodeType extends Node = Node,
  EdgeType extends Edge = Edge,
> = UseStoreArgs<Selected, NodeType, EdgeType>;

export interface EdgeReconnectAnchorArgs<EdgeType extends Edge = Edge> {
  edge?: EdgeType;
  edgeId?: string;
  type: HandleType;
  reconnecting?: boolean;
  position?: XYPosition;
  size?: number;
  dragThreshold?: number;
  className?: string;
  class?: string;
  style?: CssStyle;
}

export type EdgeReconnectAnchorProps<EdgeType extends Edge = Edge> = EdgeReconnectAnchorArgs<EdgeType>;

export interface EdgeReconnectAnchorEventDetail<EdgeType extends Edge = Edge> {
  edge: EdgeType;
  handleType: HandleType;
  pointerEvent: PointerEvent;
  fixedElement?: Element | null;
}

export interface NodeToolbarArgs<NodeType extends Node = Node> {
  node?: NodeType;
  nodeId?: string | string[];
  isVisible?: boolean;
  position?: Position;
  align?: Align;
  offset?: number;
  className?: string;
  style?: CssStyle;
}

export type NodeToolbarProps<NodeType extends Node = Node> = NodeToolbarArgs<NodeType>;

export interface NodeToolbarContext<NodeType extends Node = Node> {
  nodes: NodeType[];
  nodeIds: string[];
  isVisible: boolean;
}

export interface NodeResizerArgs<NodeType extends Node = Node> {
  node?: NodeType;
  nodeId?: string;
  color?: string;
  handleClassName?: string;
  handleStyle?: CssStyle;
  lineClassName?: string;
  lineStyle?: CssStyle;
  isVisible?: boolean;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  keepAspectRatio?: boolean;
  resizeDirection?: ResizeControlDirection;
  autoScale?: boolean;
  shouldResize?: ShouldResize;
  onResizeStart?: OnResizeStart;
  onResize?: OnResize;
  onResizeEnd?: OnResizeEnd;
}

export type NodeResizerProps<NodeType extends Node = Node> = NodeResizerArgs<NodeType>;

export interface NodeResizeControlArgs<NodeType extends Node = Node> extends NodeResizerArgs<NodeType> {
  position?: ControlPosition;
  variant?: ResizeControlVariant;
  className?: string;
  class?: string;
  style?: CssStyle;
}

export type NodeResizeControlProps<NodeType extends Node = Node> = NodeResizeControlArgs<NodeType>;

export type GetMiniMapNodeAttribute<NodeType extends Node = Node> = string | ((node: NodeType) => string);

export interface MiniMapArgs<NodeType extends Node = Node> {
  position?: PanelPosition;
  width?: number;
  height?: number;
  nodeColor?: GetMiniMapNodeAttribute<NodeType>;
  nodeStrokeColor?: GetMiniMapNodeAttribute<NodeType>;
  nodeClass?: GetMiniMapNodeAttribute<NodeType>;
  nodeClassName?: GetMiniMapNodeAttribute<NodeType>;
  nodeBorderRadius?: number;
  nodeStrokeWidth?: number;
  nodeComponent?: MiniMapNodeComponent;
  bgColor?: string;
  maskColor?: string;
  maskStrokeColor?: string;
  maskStrokeWidth?: number;
  ariaLabel?: string | null;
  offsetScale?: number;
  pannable?: boolean;
  zoomable?: boolean;
  inversePan?: boolean;
  zoomStep?: number;
  onClick?: (event: MouseEvent, position: { x: number; y: number }) => void;
  onNodeClick?: (event: MouseEvent, node: NodeType) => void;
}

export type MiniMapProps<NodeType extends Node = Node> = MiniMapArgs<NodeType>;

export interface MiniMapNodeArgs {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  borderRadius?: number;
  className?: string;
  color?: string;
  shapeRendering?: string;
  strokeColor?: string;
  strokeWidth?: number;
  selected?: boolean;
}

export type MiniMapNodeProps = MiniMapNodeArgs;

export interface EdgeLabelArgs {
  x?: number;
  y?: number;
  width?: number | string;
  height?: number | string;
  edgeId?: string;
  selectEdgeOnClick?: boolean;
  transparent?: boolean;
  className?: string;
  style?: CssStyle;
}

export type EdgeLabelProps = EdgeLabelArgs;

export type EdgeLabelRendererProps = Record<string, never>;

export interface EdgeToolbarArgs extends Partial<EdgeToolbarBaseProps> {
  edgeId: string;
  position?: Position;
  offset?: number;
  selectEdgeOnClick?: boolean;
  className?: string;
  style?: CssStyle;
}

export type EdgeToolbarProps = EdgeToolbarArgs;

export type ViewportPortalProps = Record<string, never>;

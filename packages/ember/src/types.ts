import type {
  Align,
  BezierPathOptions,
  DefaultEdgeOptionsBase,
  EdgeBase,
  EdgeChange as SystemEdgeChange,
  EdgePosition,
  EdgeToolbarBaseProps,
  FitViewOptionsBase,
  HandleProps as SystemHandleProps,
  NodeBase,
  NodeChange as SystemNodeChange,
  OnResize,
  OnResizeEnd,
  OnResizeStart,
  PanOnScrollMode,
  Position,
  ResizeControlDirection,
  ResizeControlVariant,
  ShouldResize,
  SmoothStepPathOptions,
  StepPathOptions,
  ControlPosition,
  CoordinateExtent,
  NodeOrigin,
  SnapGrid,
  Viewport,
} from '@xyflow/system';

export type CssStyle = string | Record<string, string | number | undefined>;
export type NodeComponent = unknown;
export type NodeTypes = Record<string, NodeComponent>;

export type Node<
  NodeData extends Record<string, unknown> = Record<string, unknown>,
  NodeType extends string | undefined = string | undefined,
> = NodeBase<NodeData, NodeType> & {
  class?: string;
  className?: string;
  style?: CssStyle;
  focusable?: boolean;
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
};

export type DefaultEdgeOptions<EdgeType extends Edge = Edge> = DefaultEdgeOptionsBase<EdgeType>;

export type BuiltInEdge =
  | (Edge<Record<string, unknown>, 'default'> & { pathOptions?: BezierPathOptions })
  | (Edge<Record<string, unknown>, 'straight'>)
  | (Edge<Record<string, unknown>, 'simplebezier'>)
  | (Edge<Record<string, unknown>, 'step'> & { pathOptions?: StepPathOptions })
  | (Edge<Record<string, unknown>, 'smoothstep'> & { pathOptions?: SmoothStepPathOptions });

export type EdgeProps<EdgeType extends Edge = Edge> = Omit<EdgeType, 'sourceHandle' | 'targetHandle'> &
  EdgePosition & {
    type?: string;
    markerStart?: string;
    markerEnd?: string;
    sourceHandleId?: string | null;
    targetHandleId?: string | null;
  };

export type EdgeTypes = Record<string, unknown>;

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

export interface EmberFlowArgs<
  NodeType extends Node = Node,
  EdgeType extends Edge = Edge,
> {
  nodes?: NodeType[];
  edges?: EdgeType[];
  nodeTypes?: NodeTypes;
  width?: number | string;
  height?: number | string;
  colorMode?: 'light' | 'dark' | 'system';
  fitView?: boolean;
  fitViewOptions?: FitViewOptions<NodeType>;
  initialViewport?: Viewport;
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
  nodesDeletable?: boolean;
  elementsSelectable?: boolean;
  selectNodesOnDrag?: boolean;
  nodeDragThreshold?: number;
  autoPanOnNodeDrag?: boolean;
  autoPanOnConnect?: boolean;
  autoPanSpeed?: number;
  deleteKey?: string;
  multiSelectionKey?: string | string[] | null;
  onMoveStart?: (event: MouseEvent | TouchEvent | null, viewport: Viewport) => void;
  onMove?: (event: MouseEvent | TouchEvent | null, viewport: Viewport) => void;
  onMoveEnd?: (event: MouseEvent | TouchEvent | null, viewport: Viewport) => void;
  onNodesChange?: (changes: NodeChange<NodeType>[]) => void;
  onEdgesChange?: (changes: EdgeChange<EdgeType>[]) => void;
  onConnect?: (connection: Connection) => void;
  onNodeClick?: (event: MouseEvent, node: NodeType) => void;
  onEdgeClick?: (event: MouseEvent, edge: EdgeType) => void;
  onPaneClick?: (event: MouseEvent) => void;
  onNodeDragStart?: (event: PointerEvent, node: NodeType) => void;
  onNodeDrag?: (event: PointerEvent, node: NodeType) => void;
  onNodeDragStop?: (event: PointerEvent, node: NodeType) => void;
  onSelectionChange?: (selection: { nodes: NodeType[]; edges: EdgeType[] }) => void;
}

export type PanelPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

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
  resizeDirection?: ResizeControlDirection;
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

import type {
  Align,
  EdgeBase,
  FitViewOptionsBase,
  NodeBase,
  PanOnScrollMode,
  Position,
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
};

export type Edge<
  EdgeData extends Record<string, unknown> = Record<string, unknown>,
  EdgeType extends string | undefined = string | undefined,
> = EdgeBase<EdgeData, EdgeType> & {
  label?: string;
  class?: string;
  className?: string;
  style?: CssStyle;
};

export type FitViewOptions<NodeType extends Node = Node> = FitViewOptionsBase<NodeType>;

export type NodeChange<NodeType extends Node = Node> = {
  id: string;
  type: 'position' | 'select' | 'remove' | 'add' | 'replace';
  item?: NodeType;
};

export type EdgeChange<EdgeType extends Edge = Edge> = {
  id: string;
  type: 'select' | 'remove' | 'add' | 'replace';
  item?: EdgeType;
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

export interface NodeToolbarArgs<NodeType extends Node = Node> {
  node?: NodeType;
  nodeId?: string;
  isVisible?: boolean;
  position?: Position;
  align?: Align;
  offset?: number;
  className?: string;
  style?: CssStyle;
}

export type NodeToolbarProps<NodeType extends Node = Node> = NodeToolbarArgs<NodeType>;

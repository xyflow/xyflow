import { CSSProperties, MouseEvent as ReactMouseEvent } from 'react';

export type ElementId = string;

export type FlowElement = Node | Edge;

export type Elements = Array<FlowElement>;

export type Transform = [number, number, number];

export enum Position {
  Left = 'left',
  Top = 'top',
  Right = 'right',
  Bottom = 'bottom',
}

export interface XYPosition {
  x: number;
  y: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

export interface Rect extends Dimensions, XYPosition {}

export interface Box extends XYPosition {
  x2: number;
  y2: number;
}

export interface Node {
  id: ElementId;
  position: XYPosition;
  type?: string;
  __rf?: any;
  data?: any;
  style?: CSSProperties;
  className?: string;
  targetPosition?: Position;
  sourcePosition?: Position;
  isHidden?: boolean;
  draggable?: boolean;
  selectable?: boolean;
  connectable?: boolean;
}

export enum ArrowHeadType {
  Arrow = 'arrow',
  ArrowClosed = 'arrowclosed',
}

export interface Edge {
  id: ElementId;
  type?: string;
  source: ElementId;
  target: ElementId;
  label?: string;
  labelStyle?: CSSProperties;
  labelShowBg?: boolean;
  labelBgStyle?: CSSProperties;
  labelBgPadding?: [number, number];
  labelBgBorderRadius?: number;
  style?: CSSProperties;
  animated?: boolean;
  arrowHeadType?: ArrowHeadType;
  isHidden?: boolean;
  data?: any;
  className?: string;
}

export enum BackgroundVariant {
  Lines = 'lines',
  Dots = 'dots',
}

export type HandleType = 'source' | 'target';

export type NodeTypesType = { [key: string]: React.ReactNode };

export type EdgeTypesType = NodeTypesType;

export interface SelectionRect extends Rect {
  startX: number;
  startY: number;
  draw: boolean;
}

export interface EdgeProps {
  id: ElementId;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  label?: string;
  labelStyle?: CSSProperties;
  labelShowBg?: boolean;
  labelBgStyle?: CSSProperties;
  labelBgPadding?: [number, number];
  labelBgBorderRadius?: number;
  style?: CSSProperties;
  arrowHeadType?: ArrowHeadType;
  markerEndId?: string;
  data?: any;
}

export interface EdgeBezierProps extends EdgeProps {
  sourcePosition: Position;
  targetPosition: Position;
}

export interface EdgeSmoothStepProps extends EdgeBezierProps {
  borderRadius?: number;
}

export interface NodeProps {
  id: ElementId;
  type: string;
  data: any;
  selected: boolean;
  isConnectable: boolean;
  targetPosition?: Position;
  sourcePosition?: Position;
}

export interface NodeComponentProps {
  id: ElementId;
  type: string;
  data: any;
  selected?: boolean;
  isConnectable: boolean;
  transform?: Transform;
  xPos?: number;
  yPos?: number;
  targetPosition?: Position;
  sourcePosition?: Position;
  onClick?: (node: Node) => void;
  onMouseEnter?: (node: Node) => void;
  onMouseMove?: (node: Node) => void;
  onMouseLeave?: (node: Node) => void;
  onContextMenu?: (node: Node) => void;
  onNodeDragStart?: (node: Node) => void;
  onNodeDragStop?: (node: Node) => void;
  style?: CSSProperties;
}

export interface WrapNodeProps {
  id: ElementId;
  type: string;
  data: any;
  selected: boolean;
  transform: Transform;
  xPos: number;
  yPos: number;
  isSelectable: boolean;
  isDraggable: boolean;
  isConnectable: boolean;
  selectNodesOnDrag: boolean;
  onClick?: (event: ReactMouseEvent, node: Node) => void;
  onMouseEnter?: (event: ReactMouseEvent, node: Node) => void;
  onMouseMove?: (event: ReactMouseEvent, node: Node) => void;
  onMouseLeave?: (event: ReactMouseEvent, node: Node) => void;
  onContextMenu?: (event: ReactMouseEvent, node: Node) => void;
  onNodeDragStart?: (event: ReactMouseEvent, node: Node) => void;
  onNodeDragStop?: (event: ReactMouseEvent, node: Node) => void;
  style?: CSSProperties;
  className?: string;
  sourcePosition?: Position;
  targetPosition?: Position;
  isHidden?: boolean;
  isInitialized?: boolean;
}

export type FitViewParams = {
  padding: number;
};
export type FitViewFunc = (fitViewOptions?: FitViewParams) => void;
export type ProjectFunc = (position: XYPosition) => XYPosition;

export type OnLoadParams = {
  zoomIn: () => void;
  zoomOut: () => void;
  zoomTo: (zoomLevel: number) => void;
  fitView: FitViewFunc;
  project: ProjectFunc;
  getElements: () => Elements;
  setTransform: (transform: FlowTransform) => void;
};

export type OnLoadFunc = (params: OnLoadParams) => void;

export interface Connection {
  source: ElementId | null;
  target: ElementId | null;
}

export enum ConnectionLineType {
  Bezier = 'default',
  Straight = 'straight',
  Step = 'step',
  SmoothStep = 'smoothstep',
}

export type OnConnectFunc = (connection: Connection) => void;
export type OnConnectStartParams = {
  nodeId: ElementId | null;
  handleType: HandleType | null;
};
export type OnConnectStartFunc = (event: ReactMouseEvent, params: OnConnectStartParams) => void;
export type OnConnectStopFunc = (event: MouseEvent) => void;
export type OnConnectEndFunc = (event: MouseEvent) => void;

export type SetConnectionId = {
  connectionNodeId: ElementId | null;
  connectionHandleType: HandleType | null;
};

export interface HandleElement extends XYPosition, Dimensions {
  id?: ElementId | null;
  position: Position;
}

export interface HandleProps {
  type: HandleType;
  position: Position;
  isConnectable?: boolean;
  onConnect?: OnConnectFunc;
  isValidConnection?: (connection: Connection) => boolean;
  id?: string;
  style?: CSSProperties;
  className?: string;
}

export interface EdgeCompProps {
  id: ElementId;
  source: ElementId;
  target: ElementId;
  type: any;
  label?: string;
  labelStyle?: CSSProperties;
  labelShowBg?: boolean;
  labelBgStyle?: CSSProperties;
  labelBgPadding?: [number, number];
  labelBgBorderRadius?: number;
  onClick?: (event: ReactMouseEvent, edge: Edge) => void;
  animated?: boolean;
  selected?: boolean;
  data?: any;
}

export interface EdgeTextProps {
  x: number;
  y: number;
  label?: string;
  labelStyle?: CSSProperties;
  labelShowBg?: boolean;
  labelBgStyle?: CSSProperties;
  labelBgPadding?: [number, number];
  labelBgBorderRadius?: number;
}

export type NodePosUpdate = {
  id: ElementId;
  pos: XYPosition;
};

export type FlowTransform = {
  x: number;
  y: number;
  zoom: number;
};

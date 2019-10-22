import { CSSProperties, SVGAttributes } from 'react';

export type ElementId = string;

export type Elements = Array<Node | Edge>;

export type Transform = [number, number, number];

export type Position = 'left' | 'top' | 'right' | 'bottom';

export type XYPosition = {
  x: number;
  y: number;
};

export enum GridType {
  Lines = 'lines',
  Dots = 'dots',
}

export type HandleType = 'source' | 'target';

export type NodeTypesType = { [key: string]: React.ReactNode };

export type EdgeTypesType = NodeTypesType;

export interface Dimensions {
  width: number;
  height: number;
}

export interface Rect extends Dimensions, XYPosition {}

export interface Box extends XYPosition {
  x2: number;
  y2: number;
}

export interface SelectionRect extends Rect {
  startX: number;
  startY: number;
  draw: boolean;
}

export interface Node {
  id: ElementId;
  position: XYPosition;
  type?: string;
  __rg?: any;
  data?: any;
  style?: CSSProperties;
}

export interface Edge {
  id: ElementId;
  type?: string;
  source: ElementId;
  target: ElementId;
  style?: SVGAttributes<{}>;
  animated?: boolean;
}

export interface EdgeProps {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  style?: SVGAttributes<{}>;
}

export interface EdgeBezierProps extends EdgeProps {
  sourcePosition: Position;
  targetPosition: Position;
}

export interface NodeProps {
  id: ElementId;
  type: string;
  data: any;
  selected: boolean;
  style?: CSSProperties;
}

export interface NodeComponentProps {
  id: ElementId;
  type: string;
  data: any;
  selected?: boolean;
  transform?: Transform;
  xPos?: number;
  yPos?: number;
  onClick?: (node: Node) => void | undefined;
  onNodeDragStop?: () => any;
  style?: CSSProperties;
}

export type FitViewParams = {
  padding: number;
};
export type FitViewFunc = (fitViewOptions: FitViewParams) => void;

type OnLoadParams = {
  zoomIn: () => void;
  zoomOut: () => void;
  fitView: FitViewFunc;
};

export type OnLoadFunc = (params: OnLoadParams) => void;

export type Connection = {
  source: ElementId | null;
  target: ElementId | null;
};

export type OnConnectFunc = (params: Connection) => void;

export interface HandleElement extends XYPosition, Dimensions {
  id?: ElementId | null;
  position: Position;
}

export interface EdgeCompProps {
  id: ElementId;
  source: ElementId;
  target: ElementId;
  type: any;
  onClick?: (edge: Edge) => void;
  animated?: boolean;
  selected?: boolean;
}

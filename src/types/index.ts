import { CSSProperties, SVGAttributes } from 'react';

export type ElementId = string;

export type Elements = Array<Node | Edge>;

export type Transform = [number, number, number];

export type Position = 'left' | 'top' | 'right' | 'bottom';

export type XYPosition = {
  x: number,
  y: number
};

export enum GridType {
  Lines = 'lines',
  Dots = 'dots',
};

export type HandleType = 'source' | 'target';

export type NodeTypesType = { [key: string]: React.ReactNode };

export type EdgeTypesType = NodeTypesType;

export interface Dimensions {
  width: number,
  height: number
}

export interface Rect extends Dimensions {
  x: number,
  y: number
};

export interface SelectionRect extends Rect {
  startX: number;
  startY: number;
  draw: boolean
};

export interface Node {
  id: ElementId,
  position?: XYPosition,
  type?: string,
  __rg?: any,
  data?: any,
  style?: CSSProperties
};

export interface Edge {
  id: ElementId,
  type?: string,
  source: ElementId,
  target: ElementId,
  style?: SVGAttributes<{}>
  animated?: boolean
};

export interface EdgeProps {
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number,
  style?: SVGAttributes<{}>
};

export interface EdgeBezierProps extends EdgeProps{
  sourcePosition: Position,
  targetPosition: Position
};

export interface NodeProps {
  id: ElementId,
  type: string,
  data: any;
  selected: boolean;
  style?: CSSProperties;
};

export interface NodeComponentProps {
  id: ElementId,
  type: string;
  data: any;
  selected?: boolean;
  transform?: Transform;
  xPos?: number;
  yPos?: number;
  onClick?: () => any;
  onNodeDragStop?: () => any;
  style?: CSSProperties;
};

export type FitViewParams = {
  padding: number
};
export type FitViewFunc = (fitViewOptions: FitViewParams) => void;

type OnLoadParams = {
  zoomIn: () => void;
  zoomOut: () => void;
  fitView: FitViewFunc
};

export type OnLoadFunc = (params: OnLoadParams) => void;

export type OnConnectParams = {
  source: ElementId;
  target: ElementId;
};

export type OnConnectFunc = (params: OnConnectParams) => void;

export type Connection = {
  source: ElementId;
  target: ElementId;
};

export interface HandleElement {
  id?: ElementId;
  position: Position;
  x: number;
  y: number;
  width: number;
  height: number;
};

export interface EdgeWrapperProps {
  id: ElementId,
  source: ElementId,
  target: ElementId,
  type: any,
  onClick?: (edge: Edge) => void
  animated?: boolean,
  selected?: boolean,
};
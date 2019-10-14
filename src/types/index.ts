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
  transform: Transform;
  xPos: number;
  yPos: number;
  selected: boolean;
  onClick: () => any;
  onNodeDragStop: () => any;
  style: CSSProperties;
};
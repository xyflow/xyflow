export type ElementId = string;

export type Elements = Array<Node | Edge>;

export type Transform = [number, number, number];

export type Position = 'left' | 'top' | 'right' | 'bottom';

export type XYPosition = {
  x: number,
  y: number
}

export type HandleType = 'source' | 'target';

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
  type?: string,
  __rg?: any,
  data?: any
};

export interface Edge {
  id: ElementId,
  type?: string,
};

export interface EdgeProps {
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number,
  style?: React.SVGAttributes<{}>
};

export interface EdgeBezierProps extends EdgeProps{
  sourcePosition: Position,
  targetPosition: Position
};

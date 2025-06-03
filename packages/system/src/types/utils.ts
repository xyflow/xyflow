/**
 * While [`PanelPosition`](/api-reference/types/panel-position) can be used to place a
 * component in the corners of a container, the `Position` enum is less precise and used
 * primarily in relation to edges and handles.
 *
 * @public
 */
export enum Position {
  Left = 'left',
  Top = 'top',
  Right = 'right',
  Bottom = 'bottom',
}

export const oppositePosition = {
  [Position.Left]: Position.Right,
  [Position.Right]: Position.Left,
  [Position.Top]: Position.Bottom,
  [Position.Bottom]: Position.Top,
};

/**
 * All positions are stored in an object with x and y coordinates.
 *
 * @public
 */
export type XYPosition = {
  x: number;
  y: number;
};

export type XYZPosition = XYPosition & { z: number };

export type Dimensions = {
  width: number;
  height: number;
};

export type Rect = Dimensions & XYPosition;

export type Box = XYPosition & {
  x2: number;
  y2: number;
};

export type Transform = [number, number, number];

/**
 * A coordinate extent represents two points in a coordinate system: one in the top
 * left corner and one in the bottom right corner. It is used to represent the
 * bounds of nodes in the flow or the bounds of the viewport.
 *
 * @public
 *
 * @remarks Props that expect a `CoordinateExtent` usually default to `[[-∞, -∞], [+∞, +∞]]`
 * to represent an unbounded extent.
 */
export type CoordinateExtent = [[number, number], [number, number]];

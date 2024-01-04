export type { D3DragEvent, SubjectPosition } from 'd3-drag';

export type XYResizeParams = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type XYResizeParamsWithDirection = XYResizeParams & {
  direction: number[];
};

export type XYResizeControlLinePosition = 'top' | 'bottom' | 'left' | 'right';

export type XYResizeControlPosition =
  | XYResizeControlLinePosition
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

export enum ResizeControlVariant {
  Line = 'line',
  Handle = 'handle',
}

export const XY_RESIZER_HANDLE_CONTROLS: XYResizeControlPosition[] = [
  'top-left',
  'top-right',
  'bottom-left',
  'bottom-right',
];
export const XY_RESIZER_LINE_CONTROLS: XYResizeControlLinePosition[] = ['top', 'right', 'bottom', 'left'];

type GetResizeDirectionParams = {
  width: number;
  prevWidth: number;
  height: number;
  prevHeight: number;
  invertX: boolean;
  invertY: boolean;
};

/**
 * Get all connecting edges for a given set of nodes
 * @param width - new width of the node
 * @param prevWidth - previous width of the node
 * @param height - new height of the node
 * @param prevHeight - previous height of the node
 * @param invertX - whether to invert the resize direction for the x axis
 * @param invertY - whether to invert the resize direction for the y axis
 * @returns array of two numbers representing the direction of the resize for each axis, 0 = no change, 1 = increase, -1 = decrease
 */
export function getResizeDirection({
  width,
  prevWidth,
  height,
  prevHeight,
  invertX,
  invertY,
}: GetResizeDirectionParams) {
  const deltaWidth = width - prevWidth;
  const deltaHeight = height - prevHeight;

  const direction = [deltaWidth > 0 ? 1 : deltaWidth < 0 ? -1 : 0, deltaHeight > 0 ? 1 : deltaHeight < 0 ? -1 : 0];

  if (deltaWidth && invertX) {
    direction[0] = direction[0] * -1;
  }

  if (deltaHeight && invertY) {
    direction[1] = direction[1] * -1;
  }
  return direction;
}

import type { D3DragEvent, SubjectPosition } from 'd3-drag';

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

type OnResizeHandler<Params = XYResizeParams, Result = void> = (event: ResizeDragEvent, params: Params) => Result;
export type ResizeDragEvent = D3DragEvent<HTMLDivElement, null, SubjectPosition>;

export type ShouldResize = OnResizeHandler<XYResizeParamsWithDirection, boolean>;
export type OnResizeStart = OnResizeHandler;
export type OnResize = OnResizeHandler<XYResizeParamsWithDirection>;
export type OnResizeEnd = OnResizeHandler;

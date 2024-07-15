import type { D3DragEvent, SubjectPosition } from 'd3-drag';

export type ResizeParams = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ResizeParamsWithDirection = ResizeParams & {
  direction: number[];
};

export type ControlLinePosition = 'top' | 'bottom' | 'left' | 'right';

export type ControlPosition = ControlLinePosition | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export enum ResizeControlVariant {
  Line = 'line',
  Handle = 'handle',
}

export const XY_RESIZER_HANDLE_POSITIONS: ControlPosition[] = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
export const XY_RESIZER_LINE_POSITIONS: ControlLinePosition[] = ['top', 'right', 'bottom', 'left'];

type OnResizeHandler<Params = ResizeParams, Result = void> = (event: ResizeDragEvent, params: Params) => Result;
export type ResizeDragEvent = D3DragEvent<HTMLDivElement, null, SubjectPosition>;

export type ShouldResize = OnResizeHandler<ResizeParamsWithDirection, boolean>;
export type OnResizeStart = OnResizeHandler;
export type OnResize = OnResizeHandler<ResizeParamsWithDirection>;
export type OnResizeEnd = OnResizeHandler;

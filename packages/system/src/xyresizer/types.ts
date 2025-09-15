import type { D3DragEvent, SubjectPosition } from 'd3-drag';

/**
 * @public
 * @inline
 */
export type ResizeParams = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ResizeParamsWithDirection = ResizeParams & {
  direction: number[];
};

/**
 * Used to determine the control line position of the NodeResizer
 *
 * @public
 * @inline
 */
export type ControlLinePosition = 'top' | 'bottom' | 'left' | 'right';

/**
 * Used to determine the control position of the NodeResizer
 *
 * @public
 * @inline
 */
export type ControlPosition = ControlLinePosition | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

/**
 * Used to determine the variant of the resize control
 *
 * @public
 */
export enum ResizeControlVariant {
  Line = 'line',
  Handle = 'handle',
}

/**
 * The direction the user can resize the node.
 * @public
 * @inline
 */
export type ResizeControlDirection = 'horizontal' | 'vertical';

export const XY_RESIZER_HANDLE_POSITIONS: ControlPosition[] = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
export const XY_RESIZER_LINE_POSITIONS: ControlLinePosition[] = ['top', 'right', 'bottom', 'left'];

type OnResizeHandler<Params = ResizeParams, Result = void> = (event: ResizeDragEvent, params: Params) => Result;
export type ResizeDragEvent = D3DragEvent<HTMLDivElement, null, SubjectPosition>;

/**
 * Callback to determine if node should resize
 *
 * @inline
 * @public
 */
export type ShouldResize = OnResizeHandler<ResizeParamsWithDirection, boolean>;
export type OnResizeStart = OnResizeHandler;
export type OnResize = OnResizeHandler<ResizeParamsWithDirection>;
export type OnResizeEnd = OnResizeHandler;

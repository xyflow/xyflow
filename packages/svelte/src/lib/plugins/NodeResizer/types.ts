import type {
  XYResizeParams,
  XYResizeParamsWithDirection,
  XYResizeControlPosition,
  ResizeControlVariant,
  D3DragEvent,
  SubjectPosition
} from '@xyflow/system';

export type NodeResizerProps = {
  nodeId?: string;
  color?: string;
  handleClass?: string;
  handleStyle?: string;
  lineClass?: string;
  lineStyle?: string;
  isVisible?: boolean;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  keepAspectRatio?: boolean;
  shouldResize?: ShouldResize;
  onResizeStart?: OnResizeStart;
  onResize?: OnResize;
  onResizeEnd?: OnResizeEnd;
};

export type ResizeControlProps = Pick<
  NodeResizerProps,
  | 'nodeId'
  | 'color'
  | 'minWidth'
  | 'minHeight'
  | 'maxWidth'
  | 'maxHeight'
  | 'keepAspectRatio'
  | 'shouldResize'
  | 'onResizeStart'
  | 'onResize'
  | 'onResizeEnd'
> & {
  position?: XYResizeControlPosition;
  variant?: ResizeControlVariant;
  class?: string;
  style?: string;
};

type OnResizeHandler<Params = XYResizeParams, Result = void> = (
  event: ResizeDragEvent,
  params: Params
) => Result;
export type ResizeDragEvent = D3DragEvent<HTMLDivElement, null, SubjectPosition>;
export type ShouldResize = OnResizeHandler<XYResizeParamsWithDirection, boolean>;
export type OnResizeStart = OnResizeHandler;
export type OnResize = OnResizeHandler<XYResizeParamsWithDirection>;
export type OnResizeEnd = OnResizeHandler;

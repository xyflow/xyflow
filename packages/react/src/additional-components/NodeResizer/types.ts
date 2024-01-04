import type { CSSProperties, ReactNode } from 'react';
import type { D3DragEvent, SubjectPosition } from 'd3-drag';
import type {
  XYResizeParams,
  XYResizeParamsWithDirection,
  XYResizeControlPosition,
  XYResizeControlLinePosition,
  ResizeControlVariant,
} from '@xyflow/system';

type OnResizeHandler<Params = XYResizeParams, Result = void> = (event: ResizeDragEvent, params: Params) => Result;
export type ResizeDragEvent = D3DragEvent<HTMLDivElement, null, SubjectPosition>;

export type ShouldResize = OnResizeHandler<XYResizeParamsWithDirection, boolean>;
export type OnResizeStart = OnResizeHandler;
export type OnResize = OnResizeHandler<XYResizeParamsWithDirection>;
export type OnResizeEnd = OnResizeHandler;

export type NodeResizerProps = {
  nodeId?: string;
  color?: string;
  handleClassName?: string;
  handleStyle?: CSSProperties;
  lineClassName?: string;
  lineStyle?: CSSProperties;
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
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

export type ResizeControlLineProps = ResizeControlProps & {
  position?: XYResizeControlLinePosition;
};

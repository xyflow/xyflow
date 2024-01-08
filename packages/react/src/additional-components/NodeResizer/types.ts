import type { CSSProperties, ReactNode } from 'react';
import type {
  XYResizeControlPosition,
  XYResizeControlLinePosition,
  ResizeControlVariant,
  ShouldResize,
  OnResizeStart,
  OnResize,
  OnResizeEnd,
} from '@xyflow/system';

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

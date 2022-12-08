import type { CSSProperties, ReactNode } from 'react';
import type { D3DragEvent, SubjectPosition } from 'd3-drag';

export type ResizeEventParams = {
  x: number;
  y: number;
  width: number;
  height: number;
};

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
  onResizeStart?: (event: ResizeDragEvent, params: ResizeEventParams) => void;
  onResize?: (event: ResizeDragEvent, params: ResizeEventParams) => void;
  onResizeEnd?: (event: ResizeDragEvent, params: ResizeEventParams) => void;
};

export type ControlLinePosition = 'top' | 'bottom' | 'left' | 'right';

export type ControlPosition = ControlLinePosition | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export enum ResizeControlVariant {
  Line = 'line',
  Handle = 'handle',
}

export type ResizeControlProps = Pick<
  NodeResizerProps,
  'nodeId' | 'color' | 'minWidth' | 'minHeight' | 'onResizeStart' | 'onResize' | 'onResizeEnd'
> & {
  position?: ControlPosition;
  variant?: ResizeControlVariant;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

export type ResizeControlLineProps = ResizeControlProps & {
  position?: ControlLinePosition;
};

export type ResizeDragEvent = D3DragEvent<HTMLDivElement, null, SubjectPosition>;

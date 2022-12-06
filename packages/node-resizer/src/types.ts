import type { CSSProperties, ReactNode } from 'react';
import type { D3DragEvent, SubjectPosition } from 'd3-drag';

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
};

export type ControlLinePosition = 'top' | 'bottom' | 'left' | 'right';

export type ControlPosition = ControlLinePosition | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export enum ResizeControlVariant {
  Line = 'line',
  Handle = 'handle',
}

export type ResizeControlProps = {
  nodeId?: string;
  position?: ControlPosition;
  variant?: ResizeControlVariant;
  color?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  minWidth?: number;
  minHeight?: number;
};

export type ResizeControlLineProps = ResizeControlProps & {
  position: ControlLinePosition;
};

export type ResizeDragEvent = D3DragEvent<HTMLDivElement, null, SubjectPosition>;

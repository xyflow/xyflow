import type { CSSProperties, ReactNode } from 'react';
import type { D3DragEvent, SubjectPosition } from 'd3-drag';

export type NodeResizerProps = {
  nodeId: string;
  handleClassName?: string;
  handleStyle?: CSSProperties;
  lineClassName?: string;
  lineStyle?: CSSProperties;
};

export type ControlLinePosition = 'top' | 'bottom' | 'left' | 'right';

export type ControlPosition = ControlLinePosition | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export type ResizeControlProps = {
  nodeId: string;
  position: ControlPosition;
  variant?: 'line' | 'handle';
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

export type ResizeControlLineProps = ResizeControlProps & {
  position: ControlLinePosition;
};

export type ResizeDragEvent = D3DragEvent<HTMLDivElement, null, SubjectPosition>;

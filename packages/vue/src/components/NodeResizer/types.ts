import type {
  ControlLinePosition,
  ControlPosition,
  ResizeControlVariant,
  ResizeDragEvent,
  ResizeParams,
  ResizeParamsWithDirection,
  ShouldResize,
} from '@xyflow/system';
import type { CSSProperties } from 'vue';

export type {
  ControlLinePosition,
  ControlPosition,
  ResizeDragEvent,
  ResizeParams,
  ResizeParamsWithDirection,
  ShouldResize,
} from '@xyflow/system';
export { ResizeControlVariant } from '@xyflow/system';

export interface OnResizeStart {
  event: ResizeDragEvent;
  params: ResizeParams;
}

export interface OnResize {
  event: ResizeDragEvent;
  params: ResizeParamsWithDirection;
}

export interface OnResizeEnd {
  event: ResizeDragEvent;
  params: ResizeParams;
}

export interface NodeResizerProps {
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
  shouldResize?: ShouldResize;
  keepAspectRatio?: boolean | number;
  /**
   * Scale the controls with the zoom level.
   * @default true
   */
  autoScale?: boolean;
}

export interface NodeResizerEmits {
  resizeStart: [resizeEvent: OnResizeStart];
  resize: [resizeEvent: OnResize];
  resizeEnd: [resizeEvent: OnResizeStart];
}

export interface ResizeControlProps extends NodeResizerProps {
  nodeId?: string;
  color?: string;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  position?: ControlPosition;
  variant?: ResizeControlVariant;
  shouldResize?: ShouldResize;
  keepAspectRatio?: boolean | number;
  /**
   * Scale the controls with the zoom level.
   * @default true
   */
  autoScale?: boolean;
}

export interface ResizeControlLineProps extends ResizeControlProps {
  nodeId?: string;
  color?: string;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  variant?: ResizeControlVariant;
  position?: ControlLinePosition;
  keepAspectRatio?: boolean | number;
}

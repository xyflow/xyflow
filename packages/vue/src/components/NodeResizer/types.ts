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
  /** The pointer event that started the resize. */
  event: ResizeDragEvent;
  /** The node's position and dimensions at the start of the resize. */
  params: ResizeParams;
}

export interface OnResize {
  /** The pointer event driving the resize. */
  event: ResizeDragEvent;
  /** The node's current position and dimensions, plus the direction being dragged. */
  params: ResizeParamsWithDirection;
}

export interface OnResizeEnd {
  /** The pointer event that ended the resize. */
  event: ResizeDragEvent;
  /** The node's final position and dimensions. */
  params: ResizeParams;
}

export interface NodeResizerProps {
  /**
   * Id of the node it is resizing.
   * @remarks optional if used inside custom node
   */
  nodeId?: string;
  /** Color of the resize handle. */
  color?: string;
  /** Class name applied to handle. */
  handleClassName?: string;
  /** Style applied to handle. */
  handleStyle?: CSSProperties;
  /** Class name applied to line. */
  lineClassName?: string;
  /** Style applied to line. */
  lineStyle?: CSSProperties;
  /**
   * Are the controls visible.
   * @default true
   */
  isVisible?: boolean;
  /**
   * Minimum width of node.
   * @default 10
   */
  minWidth?: number;
  /**
   * Minimum height of node.
   * @default 10
   */
  minHeight?: number;
  /**
   * Maximum width of node.
   * @default Number.MAX_VALUE
   */
  maxWidth?: number;
  /**
   * Maximum height of node.
   * @default Number.MAX_VALUE
   */
  maxHeight?: number;
  /** Callback to determine if node should resize. */
  shouldResize?: ShouldResize;
  /**
   * Keep aspect ratio when resizing.
   * @default false
   */
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
  /**
   * Position of the control.
   * @example ControlPosition.TopLeft, ControlPosition.TopRight,
   * ControlPosition.BottomLeft, ControlPosition.BottomRight
   */
  position?: ControlPosition;
  /**
   * Variant of the control.
   * @default "handle"
   * @example ResizeControlVariant.Handle, ResizeControlVariant.Line
   */
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

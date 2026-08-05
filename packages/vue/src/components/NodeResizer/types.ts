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
   * Id of the node to resize. Defaults to the node the resizer is rendered in, so you usually only set this
   * to control another node's size from outside it.
   */
  nodeId?: string;
  /** Color of the resize handles and lines. */
  color?: string;
  /** Extra class name applied to each resize handle. */
  handleClassName?: string;
  /** Inline style applied to each resize handle. */
  handleStyle?: CSSProperties;
  /** Extra class name applied to each resize line. */
  lineClassName?: string;
  /** Inline style applied to each resize line. */
  lineStyle?: CSSProperties;
  /**
   * Whether the resize controls are rendered.
   *
   * @default true
   */
  isVisible?: boolean;
  /**
   * Minimum width the node can be resized to, in pixels.
   *
   * @default 10
   */
  minWidth?: number;
  /**
   * Minimum height the node can be resized to, in pixels.
   *
   * @default 10
   */
  minHeight?: number;
  /** Maximum width the node can be resized to, in pixels. */
  maxWidth?: number;
  /** Maximum height the node can be resized to, in pixels. */
  maxHeight?: number;
  /** Callback to control whether a resize is allowed and clamp its result. */
  shouldResize?: ShouldResize;
  /** Lock the aspect ratio while resizing. Pass a number to force a specific ratio. */
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
   * Which handle or line this control represents, e.g. `'top-left'` or `'right'`. Defaults to the position
   * implied by `variant`.
   */
  position?: ControlPosition;
  /**
   * Whether the control is a corner handle or an edge line, see {@link ResizeControlVariant}.
   *
   * @default ResizeControlVariant.Handle
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

import type {
  ControlPosition,
  ControlLinePosition,
  ResizeControlVariant,
  ResizeControlDirection,
  ShouldResize,
  OnResizeStart,
  OnResize,
  OnResizeEnd,
} from '@xyflow/system';

/**
 * Angular equivalent of NodeResizerProps
 */
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
  handleStyle?: Record<string, any>;
  /** Class name applied to line. */
  lineClassName?: string;
  /** Style applied to line. */
  lineStyle?: Record<string, any>;
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
  /**
   * Keep aspect ratio when resizing.
   * @default false
   */
  keepAspectRatio?: boolean;
  /**
   * Scale the controls with the zoom level.
   * @default true
   */
  autoScale?: boolean;
  /** Callback to determine if node should resize. */
  shouldResize?: ShouldResize;
  /** Callback called when resizing starts. */
  onResizeStart?: OnResizeStart;
  /** Callback called when resizing. */
  onResize?: OnResize;
  /** Callback called when resizing ends. */
  onResizeEnd?: OnResizeEnd;
}

/**
 * Angular equivalent of ResizeControlProps
 */
export interface ResizeControlProps extends Pick<
  NodeResizerProps,
  | 'nodeId'
  | 'color'
  | 'minWidth'
  | 'minHeight'
  | 'maxWidth'
  | 'maxHeight'
  | 'keepAspectRatio'
  | 'shouldResize'
  | 'autoScale'
  | 'onResizeStart'
  | 'onResize'
  | 'onResizeEnd'
> {
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
  /**
   * The direction the user can resize the node.
   * If not provided, the user can resize in any direction.
   */
  resizeDirection?: ResizeControlDirection;
  className?: string;
  style?: Record<string, any>;
}

/**
 * Angular equivalent of ResizeControlLineProps
 */
export interface ResizeControlLineProps extends Omit<ResizeControlProps, 'resizeDirection'> {
  position?: ControlLinePosition;
}

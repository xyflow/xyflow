import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type {
  ControlPosition,
  ResizeControlVariant,
  ResizeControlDirection,
  ShouldResize,
  OnResizeStart,
  OnResize,
  OnResizeEnd
} from '@xyflow/system';

export type NodeResizerProps = {
  /** Id of the node it is resizing
   * @remarks optional if used inside custom node
   */
  nodeId?: string;
  /** Color of the resize handle */
  color?: string;
  /** Class applied to handle */
  handleClass?: string;
  /** Style applied to handle */
  handleStyle?: string;
  /** Class applied to line */
  lineClass?: string;
  /** Style applied to line */
  lineStyle?: string;
  /** Are the controls visible */
  isVisible?: boolean;
  /** Minimum width of node */
  minWidth?: number;
  /** Minimum height of node */
  minHeight?: number;
  /** Maximum width of node */
  maxWidth?: number;
  /** Maximum height of node */
  maxHeight?: number;
  /** Keep aspect ratio when resizing */
  keepAspectRatio?: boolean;
  /** Automatically scale the node when resizing */
  autoScale?: boolean;
  /** Callback to determine if node should resize */
  shouldResize?: ShouldResize;
  /** Callback called when resizing starts */
  onResizeStart?: OnResizeStart;
  /** Callback called when resizing */
  onResize?: OnResize;
  /** Callback called when resizing ends */
  onResizeEnd?: OnResizeEnd;
  /** The direction the user can resize the node */
  resizeDirection?: ResizeControlDirection;
} & HTMLAttributes<HTMLDivElement>;

export type ResizeControlProps = Pick<
  NodeResizerProps,
  | 'color'
  | 'minWidth'
  | 'minHeight'
  | 'maxWidth'
  | 'maxHeight'
  | 'keepAspectRatio'
  | 'autoScale'
  | 'shouldResize'
  | 'onResizeStart'
  | 'onResize'
  | 'onResizeEnd'
  | 'resizeDirection'
> & {
  /** Position of control
   * @example ControlPosition.TopLeft, ControlPosition.TopRight,
   * ControlPosition.BottomLeft, ControlPosition.BottomRight
   */
  position?: ControlPosition;
  /** Variant of control
   * @example ResizeControlVariant.Handle, ResizeControlVariant.Line
   */
  variant?: ResizeControlVariant;
  /** nodeId must be provided when used outside a custom node */
  nodeId?: string;
  children?: Snippet;
} & HTMLAttributes<HTMLDivElement>;

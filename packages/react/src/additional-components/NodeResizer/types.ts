import type { CSSProperties, ReactNode } from 'react';
import type {
  ControlPosition,
  ControlLinePosition,
  ResizeControlVariant,
  ShouldResize,
  OnResizeStart,
  OnResize,
  OnResizeEnd,
} from '@xyflow/system';

export type NodeResizerProps = {
  /** id of the node it is resizing
   * @remarks optional if used inside custom node
   */
  nodeId?: string;
  /** color of the resize handle */
  color?: string;
  /** className applied to handle */
  handleClassName?: string;
  /** style applied to handle */
  handleStyle?: CSSProperties;
  /** className applied to line */
  lineClassName?: string;
  /** style applied to line */
  lineStyle?: CSSProperties;
  /** are the controls visible */
  isVisible?: boolean;
  /** minimum width of node */
  minWidth?: number;
  /** minimum height of node */
  minHeight?: number;
  /** maximum width of node */
  maxWidth?: number;
  /** maximum height of node */
  maxHeight?: number;
  /** keep aspect ratio when resizing */
  keepAspectRatio?: boolean;
  /** callback to determine if node should resize */
  shouldResize?: ShouldResize;
  /** callback called when resizing starts */
  onResizeStart?: OnResizeStart;
  /** callback called when resizing */
  onResize?: OnResize;
  /** callback called when resizing ends */
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
  /** position of the control
   * @example ControlPosition.TopLeft, ControlPosition.TopRight,
   * ControlPosition.BottomLeft, ControlPosition.BottomRight
   */
  position?: ControlPosition;
  /** variant of the control
   * @example ResizeControlVariant.Handle, ResizeControlVariant.Line
   */
  variant?: ResizeControlVariant;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

export type ResizeControlLineProps = ResizeControlProps & {
  position?: ControlLinePosition;
};

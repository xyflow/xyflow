import type {
  ControlPosition,
  ResizeControlVariant,
  ShouldResize,
  OnResizeStart,
  OnResize,
  OnResizeEnd
} from '@xyflow/system';

export type NodeResizerProps = {
  nodeId?: string;
  color?: string;
  handleClass?: string;
  handleStyle?: string;
  lineClass?: string;
  lineStyle?: string;
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
  position?: ControlPosition;
  variant?: ResizeControlVariant;
  class?: string;
  style?: string;
};

import type { Node, NodeResizerProps } from '@xyflow/react';

export type ResizeNode = Node<
  Pick<
    NodeResizerProps,
    | 'minWidth'
    | 'maxWidth'
    | 'minHeight'
    | 'maxHeight'
    | 'isVisible'
    | 'shouldResize'
    | 'onResizeStart'
    | 'onResize'
    | 'onResizeEnd'
    | 'keepAspectRatio'
  > & { label?: string }
>;

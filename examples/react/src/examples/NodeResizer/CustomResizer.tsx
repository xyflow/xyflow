import { memo, FC } from 'react';
import { Handle, Position, NodeProps, NodeResizeControl } from '@xyflow/react';

import ResizeIcon from './ResizeIcon';

const controlStyle = {
  background: 'transparent',
  border: 'none',
};

const CustomResizerNode: FC<NodeProps> = ({ data }) => {
  return (
    <>
      <NodeResizeControl
        minWidth={data.minWidth ?? undefined}
        maxWidth={data.maxWidth ?? undefined}
        minHeight={data.minHeight ?? undefined}
        maxHeight={data.maxHeight ?? undefined}
        shouldResize={data.shouldResize ?? undefined}
        onResizeStart={data.onResizeStart ?? undefined}
        onResize={data.onResize ?? undefined}
        onResizeEnd={data.onResizeEnd ?? undefined}
        keepAspectRatio={data.keepAspectRatio ?? undefined}
        style={controlStyle}
      >
        <ResizeIcon />
      </NodeResizeControl>

      <Handle type="target" position={Position.Left} />
      <div>{data.label}</div>
      <Handle type="source" position={Position.Right} />
    </>
  );
};

export default memo(CustomResizerNode);

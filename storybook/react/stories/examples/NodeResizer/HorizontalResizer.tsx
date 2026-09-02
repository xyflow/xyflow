import { memo, FC } from 'react';
import { Handle, Position, NodeProps, NodeResizeControl } from '@xyflow/react';

const HorizontalResizerNode: FC<NodeProps> = ({ data }) => {
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
        color="red"
        position={Position.Left}
      />
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
        color="red"
        position={Position.Right}
      />
      <Handle type="target" position={Position.Top} />
      <div style={{ padding: 10 }}>{data.label}</div>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
};

export default memo(HorizontalResizerNode);

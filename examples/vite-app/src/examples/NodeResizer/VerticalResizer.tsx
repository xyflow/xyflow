import { memo, FC } from 'react';
import { Handle, Position, NodeProps, NodeResizeControl } from '@xyflow/react';

const CustomNode: FC<NodeProps> = ({ id, data }) => {
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
        position={Position.Top}
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
        position={Position.Bottom}
      />
      <Handle type="target" position={Position.Left} />
      <div style={{ padding: 10 }}>{data.label}</div>
      <Handle type="source" position={Position.Right} />
    </>
  );
};

export default memo(CustomNode);

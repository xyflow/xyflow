import { memo, FC } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

import { NodeResizeControl, ResizeDragEvent, ResizeEventParams } from '@reactflow/node-resizer';
import '@reactflow/node-resizer/dist/style.css';

const onBeforeResize = (event: ResizeDragEvent, params: ResizeEventParams) => {
  console.log('before resize', params);

  if (params.width > 100) {
    return false;
  }
};

const onResize = (event: ResizeDragEvent, params: ResizeEventParams) => {
  console.log('resize', params);
};

const CustomNode: FC<NodeProps> = ({ id, data }) => {
  return (
    <>
      <NodeResizeControl color="red" position={Position.Left} />
      <NodeResizeControl color="red" position={Position.Right} onBeforeResize={onBeforeResize} onResize={onResize} />
      <Handle type="target" position={Position.Top} />
      <div style={{ padding: 10 }}>{data.label}</div>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
};

export default memo(CustomNode);

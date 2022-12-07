import { memo, FC } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

import { NodeResizer, ResizeDragEvent, ResizeEventParams } from '@reactflow/node-resizer';
import '@reactflow/node-resizer/dist/style.css';

const onResizeStart = (_: ResizeDragEvent, params: ResizeEventParams) => {
  console.log('resize start', params);
};

const onResize = (_: ResizeDragEvent, params: ResizeEventParams) => {
  console.log('resize', params);
};

const onResizeEnd = (_: ResizeDragEvent, params: ResizeEventParams) => {
  console.log('resize end', params);
};

const CustomNode: FC<NodeProps> = ({ data, selected }) => {
  return (
    <>
      <NodeResizer
        minWidth={100}
        minHeight={100}
        isVisible={selected}
        onResizeStart={onResizeStart}
        onResize={onResize}
        onResizeEnd={onResizeEnd}
      />
      <Handle type="target" position={Position.Left} />
      <div>{data.label}</div>
      <Handle type="source" position={Position.Right} />
    </>
  );
};

export default memo(CustomNode);

import { memo, FC } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

import { NodeResizer, OnBeforeResize, OnResize, OnResizeEnd, OnResizeStart } from '@reactflow/node-resizer';
import '@reactflow/node-resizer/dist/style.css';

const onResizeStart: OnResizeStart = (_, params) => {
  console.log('resize start', params);
};

const onBeforeResize: OnBeforeResize = (_, params) => {
  console.log('before resize', params);
};

const onResize: OnResize = (_, params) => {
  console.log('resize', params);
};

const onResizeEnd: OnResizeEnd = (_, params) => {
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
        onBeforeResize={onBeforeResize}
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

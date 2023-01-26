import { memo, FC } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

import { NodeResizer, ShouldResize, OnResize, OnResizeEnd, OnResizeStart } from '@reactflow/node-resizer';
import '@reactflow/node-resizer/dist/style.css';

const onResizeStart: OnResizeStart = (_, params) => {
  console.log('resize start', params);
};

const onResize: OnResize = (_, params) => {
  console.log('resize', params);
};

const onResizeEnd: OnResizeEnd = (_, params) => {
  console.log('resize end', params);
};

const shouldResize: ShouldResize = (_, params) => {
  console.log('should resize', params);

  return true;
};

const CustomNode: FC<NodeProps> = ({ data, selected }) => {
  return (
    <>
      <NodeResizer
        minWidth={100}
        minHeight={100}
        isVisible={selected}
        shouldResize={shouldResize}
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

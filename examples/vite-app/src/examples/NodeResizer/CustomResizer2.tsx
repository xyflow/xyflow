import { memo, FC } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

import { NodeResizer, NodeResizeControl } from '@reactflow/node-resizer';
import '@reactflow/node-resizer/dist/style.css';

const CustomNode: FC<NodeProps> = ({ id, data }) => {
  return (
    <>
      <NodeResizeControl nodeId={id} position="top" />
      <NodeResizeControl nodeId={id} position="bottom" />
      <Handle type="target" position={Position.Left} />
      <div>{data.label}</div>
      <Handle type="source" position={Position.Right} />
    </>
  );
};

export default memo(CustomNode);

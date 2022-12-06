import { memo, FC } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

import { NodeResizer } from '@reactflow/node-resizer';
import '@reactflow/node-resizer/dist/style.css';

const CustomNode: FC<NodeProps> = ({ data, selected }) => {
  return (
    <>
      <NodeResizer minWidth={100} minHeight={100} isVisible={selected} />
      <Handle type="target" position={Position.Left} />
      <div>{data.label}</div>
      <Handle type="source" position={Position.Right} />
    </>
  );
};

export default memo(CustomNode);

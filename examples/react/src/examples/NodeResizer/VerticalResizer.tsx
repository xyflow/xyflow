import { memo, FC } from 'react';
import { Handle, Position, NodeProps, NodeResizeControl } from '@xyflow/react';
import { ResizerNode } from '.';

const CustomNode: FC<NodeProps<ResizerNode>> = ({ id, data }) => {
  return (
    <>
      <NodeResizeControl {...data} color="red" position={Position.Top} />
      <NodeResizeControl {...data} color="red" position={Position.Bottom} />
      <Handle type="target" position={Position.Left} />
      <div style={{ padding: 10 }}>{data.label}</div>
      <Handle type="source" position={Position.Right} />
    </>
  );
};

export default memo(CustomNode);

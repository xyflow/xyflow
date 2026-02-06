import { memo, FC } from 'react';
import { Handle, Position, NodeProps, NodeResizeControl } from '@xyflow/react';
import { ResizerNode } from '.';

const HorizontalResizerNode: FC<NodeProps<ResizerNode>> = ({ data }) => {
  return (
    <>
      <NodeResizeControl {...data} color="red" position={Position.Left} />
      <NodeResizeControl {...data} color="red" position={Position.Right} />
      <Handle type="target" position={Position.Top} />
      <div style={{ padding: 10 }}>{data.label}</div>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
};

export default memo(HorizontalResizerNode);

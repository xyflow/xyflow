import { memo, FC, CSSProperties } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';

const nodeStyles: CSSProperties = {
  padding: '10px 15px',
  border: '1px solid #ddd',
};

const CustomNode: FC<NodeProps> = ({ id }) => {
  return (
    <div style={nodeStyles}>
      <div>node {id}</div>
      <Handle type="source" id="left" position={Position.Left} />
      <Handle type="source" id="right" position={Position.Right} />
      <Handle type="source" id="top" position={Position.Top} />
      <Handle type="source" id="bottom" position={Position.Bottom} />
    </div>
  );
};

export default memo(CustomNode);

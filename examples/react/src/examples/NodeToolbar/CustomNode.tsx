import { memo, FC } from 'react';
import { Handle, Position, NodeProps, NodeToolbar } from '@xyflow/react';

const CustomNode: FC<NodeProps> = ({ id, data }) => {
  return (
    <>
      <NodeToolbar isVisible={data.toolbarVisible} position={data.toolbarPosition} align={data.toolbarAlign}>
        <button>delete</button>
        <button>copy</button>
        <button>expand</button>
      </NodeToolbar>
      <div>{data.label}</div>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </>
  );
};

export default memo(CustomNode);

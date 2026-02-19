import { memo, FC } from 'react';
import { Handle, Position, NodeProps, NodeResizer, useKeyPress } from '@xyflow/react';
import { ResizerNode } from '.';

const DefaultResizerNode: FC<NodeProps<ResizerNode>> = ({ data, selected }) => {
  return (
    <>
      <NodeResizer {...data} isVisible={!!selected} />
      <Handle type="target" position={Position.Left} />
      <div>{data.label}</div>
      <Handle type="source" position={Position.Right} />
    </>
  );
};

export default memo(DefaultResizerNode);

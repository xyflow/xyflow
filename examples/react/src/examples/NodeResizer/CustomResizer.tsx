import { memo, FC } from 'react';
import { Handle, Position, NodeProps, NodeResizeControl } from '@xyflow/react';

import ResizeIcon from './ResizeIcon';
import { ResizerNode } from '.';

const controlStyle = {
  background: 'transparent',
  border: 'none',
};

const CustomResizerNode: FC<NodeProps<ResizerNode>> = ({ data }) => {
  return (
    <>
      <NodeResizeControl style={controlStyle} {...data}>
        <ResizeIcon />
      </NodeResizeControl>

      <Handle type="target" position={Position.Left} />
      <div>{data.label}</div>
      <Handle type="source" position={Position.Right} />
    </>
  );
};

export default memo(CustomResizerNode);

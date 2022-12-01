import { memo, FC } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

import { NodeResizer } from '@reactflow/node-resizer';

const ColorSelectorNode: FC<NodeProps> = ({ id, data }) => {
  return (
    <>
      <Handle type="target" position={Position.Left} />
      <div>{data.label}</div>
      <Handle type="source" position={Position.Right} />

      <NodeResizer nodeId={id} />
    </>
  );
};

export default memo(ColorSelectorNode);

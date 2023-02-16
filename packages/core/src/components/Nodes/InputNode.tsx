import { memo } from 'react';
import { Position, type NodeProps } from '@reactflow/system';

import Handle from '../../components/Handle';

const InputNode = ({ data, isConnectable, sourcePosition = Position.Bottom }: NodeProps) => (
  <>
    {data?.label}
    <Handle type="source" position={sourcePosition} isConnectable={isConnectable} />
  </>
);

InputNode.displayName = 'InputNode';

export default memo(InputNode);

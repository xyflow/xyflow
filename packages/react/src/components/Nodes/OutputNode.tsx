import { memo } from 'react';
import { Position, type NodeProps } from '@xyflow/system';

import Handle from '../../components/Handle';

const OutputNode = ({ data, isConnectable, targetPosition = Position.Top }: NodeProps) => (
  <>
    <Handle type="target" position={targetPosition} isConnectable={isConnectable} />
    {data?.label}
  </>
);

OutputNode.displayName = 'OutputNode';

export default memo(OutputNode);

import { memo } from 'react';

import Handle from '../../components/Handle';
import { NodeProps, Position } from '../../types';

const OutputNode = ({ data, isConnectable, targetPosition = Position.Top }: NodeProps) => (
  <>
    <Handle type="target" position={targetPosition} isConnectable={isConnectable} />
    {data?.label}
  </>
);

OutputNode.displayName = 'OutputNode';

export default memo(OutputNode);

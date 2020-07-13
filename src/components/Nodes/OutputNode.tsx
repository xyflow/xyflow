import React, { memo } from 'react';

import Handle from '../../components/Handle';
import { NodeProps, Position } from '../../types';

const OutputNode = memo(({ data, isConnectable, targetPosition = Position.Top }: NodeProps) => (
  <>
    <Handle type="target" position={targetPosition} isConnectable={isConnectable} />
    {data.label}
  </>
));

OutputNode.displayName = 'OutputNode';

export default OutputNode;

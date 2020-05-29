import React from 'react';

import Handle from '../../components/Handle';
import { NodeProps, Position } from '../../types';

const OutputNode = ({ data, targetPosition = Position.Top }: NodeProps) => (
  <>
    <Handle type="target" position={targetPosition} />
    {data.label}
  </>
);

OutputNode.displayName = 'OutputNode';

export default OutputNode;

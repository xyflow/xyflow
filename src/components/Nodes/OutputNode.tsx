import React from 'react';

import Handle from '../../components/Handle';
import { NodeProps, Position } from '../../types';

export default ({ data, targetPosition = Position.Top }: NodeProps) => (
  <>
    <Handle type="target" position={targetPosition} />
    {data.label}
  </>
);

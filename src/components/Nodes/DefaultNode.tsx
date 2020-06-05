import React, { memo } from 'react';

import Handle from '../../components/Handle';
import { NodeProps, Position } from '../../types';

const DefaultNode = memo(({ data, targetPosition = Position.Top, sourcePosition = Position.Bottom }: NodeProps) => (
  <>
    <Handle type="target" position={targetPosition} />
    {data.label}
    <Handle type="source" position={sourcePosition} />
  </>
));

DefaultNode.displayName = 'DefaultNode';

export default DefaultNode;

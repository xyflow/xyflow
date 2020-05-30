import React from 'react';

import Handle from '../../components/Handle';
import { NodeProps, Position } from '../../types';

const InputNode = ({ data, sourcePosition = Position.Bottom }: NodeProps) => (
  <>
    {data.label}
    <Handle type="source" position={sourcePosition} />
  </>
);

InputNode.displayName = 'InputNode';

export default InputNode;

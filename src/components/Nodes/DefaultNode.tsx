import React, { CSSProperties } from 'react';

import Handle from '../../components/Handle';
import { NodeProps, Position } from '../../types';

const nodeStyles: CSSProperties = {
  background: '#ff6060',
  padding: 10,
  borderRadius: 5,
  width: 150,
};

export default ({ data, targetPosition = Position.Top, sourcePosition = Position.Bottom, style }: NodeProps) => (
  <div style={{ ...nodeStyles, ...style }}>
    <Handle type="target" position={targetPosition} />
    {data.label}
    <Handle type="source" position={sourcePosition} />
  </div>
);

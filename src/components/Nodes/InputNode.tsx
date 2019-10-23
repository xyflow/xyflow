import React, { CSSProperties } from 'react';

import Handle from '../../components/Handle';
import { NodeProps, Position } from '../../types';

const nodeStyles: CSSProperties = {
  background: '#9999ff',
  padding: 10,
  borderRadius: 5,
  width: 150,
};

export default ({ data, style, sourcePosition = Position.Bottom }: NodeProps) => (
  <div style={{ ...nodeStyles, ...style }}>
    {data.label}
    <Handle type="source" position={sourcePosition} />
  </div>
);

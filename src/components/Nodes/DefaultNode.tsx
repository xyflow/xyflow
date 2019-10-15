import React, { CSSProperties } from 'react';

import Handle from '../../components/Handle';
import { NodeProps } from '../../types';

const nodeStyles: CSSProperties = {
  background: '#ff6060',
  padding: 10,
  borderRadius: 5,
  width: 150
};

export default ({ data, style }: NodeProps) => (
  <div style={{ ...nodeStyles, ...style }}>
    <Handle type="target" position="top" />
    {data.label}
    <Handle type="source" position="bottom" />
  </div>
);

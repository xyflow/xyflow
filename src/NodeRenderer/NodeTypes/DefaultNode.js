import React from 'react';

import Handle from '../HandleTypes/Handle';

const nodeStyles = {
  background: '#ff6060',
  padding: 10,
  borderRadius: 5,
  width: 150
};

export default ({ data, style }) => (
  <div style={{ ...nodeStyles, ...style }}>
    <Handle type="target" position="top" />
    {data.label}
    <Handle type="source" position="bottom" />
  </div>
);

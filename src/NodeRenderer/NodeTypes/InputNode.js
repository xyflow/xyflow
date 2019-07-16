import React from 'react';

import Handle from '../Handle';

const nodeStyles = {
  background: '#9999ff',
  padding: 10,
  borderRadius: 5
};

export default ({ data, style }) => (
  <div style={{ ...nodeStyles, ...style }}>
    {data.label}
    <Handle style={{ bottom: 0, top: 'auto', transform: 'translate(-50%, 50%)' }} />
  </div>
);

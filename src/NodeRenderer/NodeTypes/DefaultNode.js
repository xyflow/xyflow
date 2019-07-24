import React from 'react';

import Handle from '../Handle';

const nodeStyles = {
  background: '#ff6060',
  padding: 10,
  borderRadius: 5,
  width: 150
};

export default ({ data, style }) => (
  <div style={{ ...nodeStyles, ...style }}>
    <Handle style={{ top: 0 }} />
    {data.label}
    <Handle style={{ bottom: 0, top: 'auto', transform: 'translate(-50%, 50%)' }} />
  </div>
);

import React from 'react';

import Handle from '../Handle';

export default ({ data, style }) => (
  <div style={{ background: '#55ff99', padding: '10px', ...style }}>
    <Handle style={{ top: 0 }} />
    {data.label}
  </div>
);

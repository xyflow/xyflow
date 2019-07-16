import React from 'react';

import Handle from '../Handle';

export default ({ data, style }) => (
  <div style={{ background: '#ff6060', padding: '10px', ...style }}>
    <Handle style={{ top: 0 }} />
    {data.label}
    <Handle style={{ bottom: 0, top: 'auto', transform: 'translate(-50%, 50%)' }} />
  </div>
);

import React from 'react';

import Handle from '../Handle';

export default ({ data, style }) => (
  <div style={{ background: '#9999ff', padding: '10px', ...style }}>
    {data.label}
    <Handle style={{ bottom: 0, top: 'auto', transform: 'translate(-50%, 50%)' }} />
  </div>
);

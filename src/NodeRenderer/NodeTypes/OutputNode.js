import React from 'react';

import wrapNode from './wrapNode';
import Handle from '../Handle';

export default wrapNode(({ data, style }) => (
  <div style={{ background: '#55ff99', padding: '10px', ...style }}>
    <Handle style={{ top: 0 }} />
    {data.label}
  </div>
));

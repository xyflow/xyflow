import React from 'react';

import TargetHandle from '../HandleTypes/TargetHandle';

const nodeStyles = {
  background: '#55dd99',
  padding: 10,
  borderRadius: 5,
  width: 150
};

export default ({ data, style }) => (
  <div style={{ ...nodeStyles, ...style }}>
    <TargetHandle />
    {data.label}
  </div>
);

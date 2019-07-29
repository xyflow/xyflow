import React from 'react';

import TargetHandle from '../HandleTypes/TargetHandle';
import SourceHandle from '../HandleTypes/SourceHandle';

const nodeStyles = {
  background: '#ff6060',
  padding: 10,
  borderRadius: 5,
  width: 150
};

export default ({ data, style }) => (
  <div style={{ ...nodeStyles, ...style }}>
    <TargetHandle />
    {data.label}
    <SourceHandle />
  </div>
);

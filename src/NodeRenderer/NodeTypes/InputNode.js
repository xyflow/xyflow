import React from 'react';

import SourceHandle from '../HandleTypes/SourceHandle';

const nodeStyles = {
  background: '#9999ff',
  padding: 10,
  borderRadius: 5,
  width: 150
};

export default ({ data, style }) => (
  <div
    style={{ ...nodeStyles, ...style }}
    className="react-graph__node-inner"
  >
    {data.label}
    <SourceHandle />
  </div>
);

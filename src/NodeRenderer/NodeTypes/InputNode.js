import React from 'react';

import Handle from '../HandleTypes/Handle';

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
    <Handle type="source" position="bottom" />
  </div>
);

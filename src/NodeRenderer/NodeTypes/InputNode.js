import React from 'react';

import Handle from '../Handle';

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
    <Handle style={{ bottom: 0, top: 'auto', transform: 'translate(-50%, 50%)' }} />
  </div>
);

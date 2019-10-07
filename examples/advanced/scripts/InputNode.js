import React from 'react';

import { Handle } from '../../../src';

export default({ data, styles }) => (
  <div
    style={{ background: '#FFCC00', padding: 10, borderRadius: 2, ...styles }}
  >
    <Handle type="target" position="left" style={{ background: '#999' }} />
    <div>{data.input}</div>
    <input onChange={(e) => data.onChange(e.target.value, data)} />
    <Handle
      type="source"
      position="right"
      style={{ background: '#999' }}
      isValidConnection={connection => +connection.target % 2 === 0}
    />
  </div>
);

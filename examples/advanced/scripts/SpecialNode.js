import React from 'react';

import { Handle } from '../../../src';

export default ({ data, styles }) => {
  return (
    <div
      style={{ background: '#FFCC00', padding: 10, borderRadius: 2, ...styles }}
    >
      <Handle
        type="target"
        position="top"
        id="a"
        style={{ left: 10, background: '#999' }}
        onConnect={params => console.log('handle onConnect', params)}
      />
      <Handle
        type="target"
        position="top"
        id="b"
        style={{ left: 30, background: '#999' }}
      />
      <div>I am <strong>special</strong>!<br />{data.label}</div>
      <select onChange={(e) => data.onChange(e.target.value, data)}>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
      </select>
      <Handle type="source" position="bottom" style={{ left: 10, background: '#999' }} />
    </div>
  );
};

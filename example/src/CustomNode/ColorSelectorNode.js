import React from 'react';

import { Handle } from 'react-flow-renderer';

export default ({ data, styles }) => {
  return (
    <div
      style={{ background: '#eee', border: '1px solid #ddd', padding: 10, borderRadius: 5, ...styles }}
    >
      <Handle
        type="target"
        position="left"
        style={{ background: '#fff' }}
        onConnect={params => console.log('handle onConnect', params)}
      />
      <div>Custom Color Picker Node: <strong>{data.color}</strong></div>
      <input className="nodrag" type="color" onChange={data.onChange} defaultValue={data.color}/>
      <Handle
        type="source"
        position="right"
        id="a"
        style={{ top: 10, background: '#fff' }}
      />
      <Handle
        type="source"
        position="right"
        id="b"
        style={{ bottom: 10, top: 'auto', background: '#fff' }}
      />
    </div>
  );
};

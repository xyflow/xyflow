import React from 'react';
import ReactFlow from 'react-flow-renderer';

const elements = [
  { id: '1', data: { label: 'Node 1' }, position: { x: 250, y: 5 } },
  // you can also pass a React component as a label
  { id: '2', data: { label: <div>Node 2</div> }, position: { x: 100, y: 100 } },
  { id: 'e1-2', source: '1', target: '2', animated: true },
];

export default () => (
  <div style={{ height: 400, border: '1px solid #EAEDF1', borderRadius: 5 }}>
    <ReactFlow elements={elements} />
  </div>
);

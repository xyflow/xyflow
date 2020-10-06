import React from 'react';
import ReactFlow from 'react-flow-renderer';

const elements = [
  // input node
  {
    id: '1',
    type: 'input',
    data: { label: 'Input Node' },
    position: { x: 250, y: 25 },
  },
  // default node
  {
    id: '2',
    // you can also pass a React component as a label
    data: { label: <div>Default Node</div> },
    position: { x: 100, y: 125 },
  },
  // output node
  {
    id: '3',
    type: 'output',
    // you can also pass a React component as a label
    data: { label: 'Output Node' },
    position: { x: 250, y: 250 },
  },
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3' },
];

export default () => (
  <div style={{ height: 300, border: '1px solid #EAEDF1', borderRadius: 5 }}>
    <ReactFlow elements={elements} />
  </div>
);

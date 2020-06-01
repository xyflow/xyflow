import React, { useState } from 'react';

import ReactFlow, { addEdge, Handle } from 'react-flow-renderer';

import './validation.css';

const initialElements = [
  { id: '0', type: 'custominput', position: { x: 0, y: 150 } },
  { id: 'A', data: { label : 'A' }, position: { x: 250, y: 0 }, targetPosition: 'left', sourcePosition: 'right' },
  { id: 'B', data: { label : 'B' }, position: { x: 250, y: 150 }, targetPosition: 'left', sourcePosition: 'right' },
  { id: 'C', data: { label : 'C' }, position: { x: 250, y:300 }, targetPosition: 'left', sourcePosition: 'right' },
];

const CustomInput = () => (
  <>
    <div>Only connectable with B</div>
    <Handle
      type="source"
      position="right"
      style={{ background: '#e6e6e9' }}
      isValidConnection={connection => connection.target === 'B'}
    />
  </>
);

const HorizontalFlow = () => {
  const [elements, setElements] = useState(initialElements);
  const onConnect = (params) => setElements(els => addEdge(params, els));

  return (
    <ReactFlow
      elements={elements}
      onConnect={onConnect}
      selectNodesOnDrag={false}
      onLoad={reactflowInstance => reactflowInstance.fitView()}
      className="validationflow"
      nodeTypes={{
        custominput: CustomInput
      }}
    />
  );
}

export default HorizontalFlow;

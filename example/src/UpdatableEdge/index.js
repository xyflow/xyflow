import React, { useState } from 'react';
import ReactFlow, { Controls, updateEdge, addEdge } from 'react-flow-renderer';

const initialElements = [
  {
    id: '1',
    type: 'input',
    data: {
      label: (
        <>
          Node <strong>A</strong>
        </>
      ),
    },
    position: { x: 250, y: 0 },
  },
  {
    id: '2',
    data: {
      label: (
        <>
          Node <strong>B</strong>
        </>
      ),
    },
    position: { x: 100, y: 100 },
  },
  {
    id: '3',
    data: {
      label: (
        <>
          Node <strong>C</strong>
        </>
      ),
    },
    position: { x: 400, y: 100 },
    style: { background: '#D6D5E6', color: '#333', border: '1px solid #222138', width: 180 },
  },
  { id: 'e1-2', source: '1', target: '2', label: 'This is a draggable edge' },
];

const onLoad = (reactFlowInstance) => reactFlowInstance.fitView();

const UpdatableEdge = () => {
  const [elements, setElements] = useState(initialElements);
  const onEdgeUpdate = (oldEdge, newConnection) => setElements((els) => updateEdge(oldEdge, newConnection, els));
  const onConnect = (params) => setElements((els) => addEdge(params, els));

  return (
    <ReactFlow elements={elements} onLoad={onLoad} snapToGrid={true} onEdgeUpdate={onEdgeUpdate} onConnect={onConnect}>
      <Controls />
    </ReactFlow>
  );
};

export default UpdatableEdge;

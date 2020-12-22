import React, { memo, useState } from 'react';
import ReactFlow, { ReactFlowProvider, removeElements, addEdge } from 'react-flow-renderer';

import Controls from './Controls';

import './save.css';

const initialElements = [
  { id: '1', data: { label: 'Node 1' }, position: { x: 100, y: 100 } },
  { id: '2', data: { label: 'Node 2' }, position: { x: 100, y: 200 } },
  { id: 'e1-2', source: '1', target: '2' },
];

const SaveRestore = () => {
  const [rfInstance, setRfInstance] = useState(null);
  const [elements, setElements] = useState(initialElements);
  const onElementsRemove = (elementsToRemove) => setElements((els) => removeElements(elementsToRemove, els));
  const onConnect = (params) => setElements((els) => addEdge(params, els));

  return (
    <ReactFlowProvider>
      <ReactFlow elements={elements} onElementsRemove={onElementsRemove} onConnect={onConnect} onLoad={setRfInstance}>
        <Controls rfInstance={rfInstance} setElements={setElements} />
      </ReactFlow>
    </ReactFlowProvider>
  );
};

export default SaveRestore;

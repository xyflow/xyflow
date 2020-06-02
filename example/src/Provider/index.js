import React, { useState } from 'react';

import ReactFlow, { addEdge, ReactFlowProvider } from 'react-flow-renderer';

const onElementClick = element => console.log('click', element);

const initialElements = [
  { id: '1', type: 'input', data: { label: 'Node 1' }, position: { x: 250, y: 5 } },
  { id: '2', data: { label: 'Node 2' }, position: { x: 100, y: 100 } },
  { id: '3', data: { label: 'Node 3' }, position: { x: 400, y: 100 } },
  { id: '4', data: { label: 'Node 4' }, position: { x: 400, y: 200 } },
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3' }
];

const ProviderFlow = () => {
  const [elements, setElements] = useState(initialElements);
  const onConnect = (params) => setElements(els => addEdge(params, els));

  return (
    <ReactFlowProvider>
      <ReactFlow
        elements={elements}
        onElementClick={onElementClick}
        onConnect={onConnect}
      />
    </ReactFlowProvider>
  );
}

export default ProviderFlow;

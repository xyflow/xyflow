import React, { useState } from 'react';

import ReactFlow, { removeElements, addEdge } from 'react-flow-renderer';

const onLoad = (graph) => {
  graph.fitView();
};

const initialElements = [
  { id: '1', sourcePosition: 'right', type: 'input', data: { label: 'Input' }, position: { x: 0, y: 80 } },
  { id: '2', sourcePosition: 'right', targetPosition: 'left', data: { label: 'A Node' }, position: { x: 250, y: 0 } },
  { id: '3', sourcePosition: 'right', targetPosition: 'left', data: { label: 'Another node' }, position: { x: 250, y: 160 } },
  { id: '4', sourcePosition: 'right', targetPosition: 'left', data: { label: 'Node 4' }, position: { x: 500, y: 80 } },
  { id: 'e1-2', source: '1', target: '2', animated: true,  },
  { id: 'e1-3', source: '1', target: '3', animated: true, },
  { id: 'e1-4', source: '2', target: '4', label: 'edge label' }
];

const HorizontalFlow = () => {
  const [elements, setElements] = useState(initialElements);
  const onElementsRemove = (elementsToRemove) =>
    setElements(els => removeElements(elementsToRemove, els));
  const onConnect = (params) => setElements(els => addEdge(params, els));

  return (
    <ReactFlow
      elements={elements}
      onElementsRemove={onElementsRemove}
      onConnect={onConnect}
      onLoad={onLoad}
      selectNodesOnDrag={false}
    />
  );
}

export default HorizontalFlow;

import React, { useState } from 'react';

import ReactFlow, { removeElements, addEdge } from 'react-flow-renderer';

const onNodeDragStop = node => console.log('drag stop', node);
const onLoad = graphInstance => console.log('graph loaded:', graphInstance);
const onElementClick = element => console.log('click', element);

const initialElements = [
  { id: '1', type: 'input', data: { label: 'Node 1' }, position: { x: 250, y: 5 } },
  { id: '2', data: { label: 'Node 2' }, position: { x: 100, y: 100 } },
  { id: '3', data: { label: 'Node 3' }, position: { x: 400, y: 100 } },
  { id: '4', data: { label: 'Node 4' }, position: { x: 400, y: 200 } },
  { id: 'e1-2', source: '1', target: '2', animated: true, label: 'edge text' },
  { id: 'e1-3', source: '1', target: '3' },
];

const BasicGraph = () => {
  const [elements, setElements] = useState(initialElements);
  const onElementsRemove = (elementsToRemove) =>
    setElements(els => removeElements(elementsToRemove, els));
  const onConnect = (params) => setElements(els => addEdge(params, els));

  return (
    <ReactFlow
      elements={elements}
      onLoad={onLoad}
      onElementClick={onElementClick}
      onElementsRemove={onElementsRemove}
      onConnect={onConnect}
      onNodeDragStop={onNodeDragStop}
      style={{ width: '100%', height: '100%' }}
      backgroundType="lines"
    />
  );
}

export default BasicGraph;

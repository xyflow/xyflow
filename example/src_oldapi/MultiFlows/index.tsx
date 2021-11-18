import React, { useState, FC } from 'react';

import ReactFlow, {
  removeElements,
  addEdge,
  Background,
  Elements,
  Edge,
  Connection,
  ReactFlowProvider,
} from 'react-flow-renderer';

import './multiflows.css';

const initialElements: Elements = [
  { id: '1', type: 'input', data: { label: 'Node 1' }, position: { x: 250, y: 5 }, className: 'light' },
  { id: '2', data: { label: 'Node 2' }, position: { x: 100, y: 100 }, className: 'light' },
  { id: '3', data: { label: 'Node 3' }, position: { x: 400, y: 100 }, className: 'light' },
  { id: '4', data: { label: 'Node 4' }, position: { x: 400, y: 200 }, className: 'light' },
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3' },
];

const Flow: FC = () => {
  const [elements, setElements] = useState<Elements>(initialElements);
  const onElementsRemove = (elementsToRemove: Elements) => setElements((els) => removeElements(elementsToRemove, els));
  const onConnect = (params: Edge | Connection) => setElements((els) => addEdge(params, els));

  return (
    <ReactFlowProvider>
      <ReactFlow elements={elements} onElementsRemove={onElementsRemove} onConnect={onConnect}>
        <Background />
      </ReactFlow>
    </ReactFlowProvider>
  );
};

const MultiFlows: FC = () => (
  <div className="react-flow__example-multiflows">
    <Flow />
    <Flow />
  </div>
);

export default MultiFlows;

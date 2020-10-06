import React, { useState } from 'react';
import ReactFlow, {
  removeElements,
  addEdge,
  ReactFlowProvider,
} from 'react-flow-renderer';

const initialElements = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Input Node' },
    position: { x: 250, y: 25 },
  },
  {
    id: '2',
    data: { label: 'Another Node' },
    position: { x: 100, y: 125 },
  },
];

const BasicFlow = () => {
  const [elements, setElements] = useState(initialElements);
  const onElementsRemove = (elementsToRemove) =>
    setElements((els) => removeElements(elementsToRemove, els));
  const onConnect = (params) => setElements((els) => addEdge(params, els));

  return (
    <div style={{ height: 300, border: '1px solid #EAEDF1', borderRadius: 5 }}>
      <ReactFlowProvider>
        <ReactFlow
          elements={elements}
          onElementsRemove={onElementsRemove}
          onConnect={onConnect}
        />
      </ReactFlowProvider>
    </div>
  );
};

export default BasicFlow;

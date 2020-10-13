/**
 * Example for checking the different edge types and source and target positions
 */
import React, { useState } from 'react';

import ReactFlow, { removeElements, addEdge, MiniMap, Controls, Background } from 'react-flow-renderer';
import { getElements } from './utils';

const onLoad = (reactFlowInstance) => {
  reactFlowInstance.fitView();
  console.log(reactFlowInstance.getElements());
};

const initialElements = getElements();

const EdgeTypesFlow = () => {
  const [elements, setElements] = useState(initialElements);
  const onElementsRemove = (elementsToRemove) => setElements((els) => removeElements(elementsToRemove, els));
  const onConnect = (params) => setElements((els) => addEdge(params, els));

  return (
    <ReactFlow
      elements={elements}
      onLoad={onLoad}
      onElementsRemove={onElementsRemove}
      onConnect={onConnect}
      minZoom={0.2}
    >
      <MiniMap />
      <Controls />
      <Background />
    </ReactFlow>
  );
};

export default EdgeTypesFlow;

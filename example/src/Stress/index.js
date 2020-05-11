import React, { useState } from 'react';

import ReactFlow, { removeElements, addEdge, MiniMap } from 'react-flow-renderer';
import { getElements } from './utils';

const onLoad = graph => {
  console.log('graph loaded:', graph);
  graph.fitView();
};

const initialElements = getElements(10, 10);

const StressGraph = () => {
  const [elements, setElements] = useState(initialElements);
  const onElementsRemove = (elementsToRemove) =>
    setElements(els => removeElements(elementsToRemove, els));
  const onConnect = (params) => setElements(els => addEdge(params, els));

  return (
    <ReactFlow
      elements={elements}
      onLoad={onLoad}
      onElementsRemove={onElementsRemove}
      onConnect={onConnect}
      style={{ width: '100%', height: '100%' }}
      backgroundType="lines"
    >
      <MiniMap />
    </ReactFlow>
  );
}

export default StressGraph;

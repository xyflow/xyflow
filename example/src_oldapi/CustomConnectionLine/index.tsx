import React, { useState } from 'react';
import ReactFlow, {
  removeElements,
  addEdge,
  Background,
  BackgroundVariant,
  Elements,
  Connection,
  Edge,
} from 'react-flow-renderer';

import ConnectionLine from './ConnectionLine';

const initialElements: Elements = [{ id: '1', type: 'input', data: { label: 'Node 1' }, position: { x: 250, y: 5 } }];

const ConnectionLineFlow = () => {
  const [elements, setElements] = useState<Elements>(initialElements);
  const onElementsRemove = (elementsToRemove: Elements) => setElements((els) => removeElements(elementsToRemove, els));
  const onConnect = (params: Connection | Edge) => setElements((els) => addEdge(params, els));

  return (
    <ReactFlow
      elements={elements}
      connectionLineComponent={ConnectionLine}
      onElementsRemove={onElementsRemove}
      onConnect={onConnect}
    >
      <Background variant={BackgroundVariant.Lines} />
    </ReactFlow>
  );
};

export default ConnectionLineFlow;

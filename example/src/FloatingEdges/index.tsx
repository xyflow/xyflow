import React, { useState } from 'react';

import ReactFlow, {
  removeElements,
  addEdge,
  MiniMap,
  Controls,
  Background,
  OnLoadParams,
  EdgeTypesType,
  Elements,
  Connection,
  Edge,
  ArrowHeadType,
} from 'react-flow-renderer';

import FloatingEdge from './FloatingEdge';
import FloatingConnectionLine from './FloatingConnectionLine';
import { createElements } from './utils';

const onLoad = (reactFlowInstance: OnLoadParams) => reactFlowInstance.fitView();

const initialElements: Elements = createElements();

const edgeTypes: EdgeTypesType = {
  floating: FloatingEdge,
};

const NodeAsHandleFlow = () => {
  const [elements, setElements] = useState<Elements>(initialElements);

  const onElementsRemove = (elementsToRemove: Elements) => setElements((els) => removeElements(elementsToRemove, els));
  const onConnect = (params: Connection | Edge) =>
    setElements((els) => addEdge({ ...params, type: 'floating', arrowHeadType: ArrowHeadType.Arrow }, els));

  return (
    <ReactFlow
      elements={elements}
      onElementsRemove={onElementsRemove}
      onConnect={onConnect}
      onLoad={onLoad}
      edgeTypes={edgeTypes}
      connectionLineComponent={FloatingConnectionLine}
    >
      <MiniMap />
      <Controls />
      <Background />
    </ReactFlow>
  );
};

export default NodeAsHandleFlow;

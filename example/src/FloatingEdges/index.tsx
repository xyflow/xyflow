import React, { useState } from 'react';

import ReactFlow, {
  removeElements,
  addEdge,
  Background,
  OnLoadParams,
  EdgeTypesType,
  Elements,
  Connection,
  Edge,
  ArrowHeadType,
} from 'react-flow-renderer';

import './style.css';

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
    <div className="floatingedges">
      <ReactFlow
        elements={elements}
        onElementsRemove={onElementsRemove}
        onConnect={onConnect}
        onLoad={onLoad}
        edgeTypes={edgeTypes}
        connectionLineComponent={FloatingConnectionLine}
      >
        <Background />
      </ReactFlow>
    </div>
  );
};

export default NodeAsHandleFlow;

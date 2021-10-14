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
  NodeTypesType,
} from 'react-flow-renderer';

import CustomEdge, { ConnectionLine } from './CustomEdge';
import CustomNode from './CustomNode';

import './style.css';

const onLoad = (reactFlowInstance: OnLoadParams) => reactFlowInstance.fitView();

const getCustomEdge = (props: any) => ({
  type: 'custom',
  arrowHeadType: ArrowHeadType.Arrow,
  ...props,
});

function createElements() {
  const elements = [];
  const center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

  elements.push({ type: 'custom', id: 'source', data: { label: 'Source', isTarget: false }, position: center });

  for (let i = 0; i < 8; i++) {
    const degrees = i * (360 / 8);
    const radians = degrees * (Math.PI / 180);
    const x = 250 * Math.cos(radians) + center.x;
    const y = 250 * Math.sin(radians) + center.y;

    elements.push({ type: 'custom', id: `${i}`, data: { label: 'Target', isTarget: true }, position: { x, y } });

    if (i % 2 === 0) {
      elements.push(
        getCustomEdge({
          id: `source-${i}`,
          source: 'source',
          target: `${i}`,
        })
      );
    }
  }

  return elements;
}

const initialElements: Elements = createElements();

const edgeTypes: EdgeTypesType = {
  custom: CustomEdge,
};

const nodeTypes: NodeTypesType = {
  custom: CustomNode,
};

const NodeAsHandleFlow = () => {
  const [elements, setElements] = useState<Elements>(initialElements);

  const onElementsRemove = (elementsToRemove: Elements) => setElements((els) => removeElements(elementsToRemove, els));
  const onConnect = (params: Connection | Edge) => setElements((els) => addEdge(getCustomEdge(params), els));

  return (
    <ReactFlow
      elements={elements}
      onElementsRemove={onElementsRemove}
      onConnect={onConnect}
      onLoad={onLoad}
      edgeTypes={edgeTypes}
      nodeTypes={nodeTypes}
      connectionLineComponent={ConnectionLine}
    >
      <MiniMap />
      <Controls />
      <Background />
    </ReactFlow>
  );
};

export default NodeAsHandleFlow;

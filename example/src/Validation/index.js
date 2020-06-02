import React, { useState } from 'react';

import ReactFlow, { addEdge, Handle } from 'react-flow-renderer';

import './validation.css';

const initialElements = [
  { id: '0', type: 'custominput', position: { x: 0, y: 150 } },
  { id: 'A', type: 'customnode', position: { x: 250, y: 0 } },
  { id: 'B', type: 'customnode', position: { x: 250, y: 150 } },
  { id: 'C', type: 'customnode', position: { x: 250, y:300 } },
];

const CustomInput = () => (
  <>
    <div>Only connectable with B</div>
    <Handle
      type="source"
      position="right"
      isValidConnection={connection => connection.target === 'B'}
    />
  </>
);

const CustomNode = ({ id }) => (
  <>
    <Handle
      type="target"
      position="left"
      isValidConnection={_ => id === 'B'}
    />
    <div>{id}</div>
    <Handle
      type="source"
      position="right"
      isValidConnection={_ => id === 'B'}
    />
  </>
);

const HorizontalFlow = () => {
  const [elements, setElements] = useState(initialElements);
  const onConnect = (params) => setElements(els => addEdge(params, els));

  return (
    <ReactFlow
      elements={elements}
      onConnect={onConnect}
      selectNodesOnDrag={false}
      onLoad={reactFlowInstance => reactFlowInstance.fitView()}
      className="validationflow"
      nodeTypes={{
        custominput: CustomInput,
        customnode: CustomNode
      }}
    />
  );
}

export default HorizontalFlow;

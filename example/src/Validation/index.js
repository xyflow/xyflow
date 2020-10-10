import React, { useState } from 'react';

import ReactFlow, { addEdge, Handle } from 'react-flow-renderer';

import './validation.css';

const initialElements = [
  { id: '0', type: 'custominput', position: { x: 0, y: 150 } },
  { id: 'A', type: 'customnode', position: { x: 250, y: 0 } },
  { id: 'B', type: 'customnode', position: { x: 250, y: 150 } },
  { id: 'C', type: 'customnode', position: { x: 250, y: 300 } },
];

const onLoad = (reactFlowInstance) => reactFlowInstance.fitView();
const isValidConnection = (connection) => {
  return (connection.target === 'B' && connection.targetHandle === '0')
}
const onConnectStart = (event, { nodeId, handleType }) => console.log('on connect start', { nodeId, handleType });
const onConnectStop = (event) => console.log('on connect stop', event);
const onConnectEnd = (event) => console.log('on connect end', event);

const CustomInput = () => (
  <>
    <div>Only connectable with B's first target</div>
    <Handle type="source" position="right" isValidConnection={isValidConnection} />
  </>
);

const CustomNode = ({ id }) => {
  if (id === 'B') {
    return (
      <>
        <Handle type="target" position="left" id='0' isValidConnection={isValidConnection} style={{top: '10px'}} />
        <Handle type="target" position="left" id='1' isValidConnection={isValidConnection} style={{top: '25px'}} />
        <div>{id}</div>
        <Handle type="source" position="right" isValidConnection={isValidConnection} />
      </>
    )  
  } else {
    return (
      <>
        <Handle type="target" position="left" isValidConnection={isValidConnection} />
        <div>{id}</div>
        <Handle type="source" position="right" isValidConnection={isValidConnection} />
      </>
    )
  }
}

const nodeTypes = {
  custominput: CustomInput,
  customnode: CustomNode,
};

const HorizontalFlow = () => {
  const [elements, setElements] = useState(initialElements);
  const onConnect = (params) => {
    console.log('on connect', params);
    setElements((els) => addEdge(params, els));
  };

  return (
    <ReactFlow
      elements={elements}
      onConnect={onConnect}
      selectNodesOnDrag={false}
      onLoad={onLoad}
      className="validationflow"
      nodeTypes={nodeTypes}
      onConnectStart={onConnectStart}
      onConnectStop={onConnectStop}
      onConnectEnd={onConnectEnd}
    />
  );
};

export default HorizontalFlow;

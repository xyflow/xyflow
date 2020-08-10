import React, { useState } from 'react';

import ReactFlow, { removeElements, addEdge, MiniMap, Controls, Background } from 'react-flow-renderer';

const onLoad = (reactFlowInstance) => console.log('flow loaded:', reactFlowInstance);
const onElementClick = (event, element) => console.log('click', element);
const onNodeDragStop = (event, node) => console.log('drag stop', node);

const EmptyFlow = () => {
  const [elements, setElements] = useState([]);
  const onElementsRemove = (elementsToRemove) => setElements((els) => removeElements(elementsToRemove, els));
  const onConnect = (params) => setElements((els) => addEdge(params, els));
  const addRandomNode = () => {
    const nodeId = (elements.length + 1).toString();
    const newNode = {
      id: nodeId,
      data: { label: `Node: ${nodeId}` },
      position: { x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight },
    };
    setElements((els) => els.concat(newNode));
  };

  return (
    <ReactFlow
      elements={elements}
      onLoad={onLoad}
      onElementClick={onElementClick}
      onElementsRemove={onElementsRemove}
      onConnect={(p) => onConnect(p)}
      onNodeDragStop={onNodeDragStop}
    >
      <MiniMap />
      <Controls />
      <Background variant="lines" />

      <button type="button" onClick={addRandomNode} style={{ position: 'absolute', left: 10, top: 10, zIndex: 4 }}>
        add node
      </button>
    </ReactFlow>
  );
};

export default EmptyFlow;

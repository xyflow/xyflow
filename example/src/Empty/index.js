import React, { useState } from 'react';

import Graph, { removeElements, addEdge, MiniMap, Controls } from 'react-flow';

const onNodeDragStop = node => console.log('drag stop', node);
const onLoad = graphInstance => console.log('graph loaded:', graphInstance);
const onElementClick = element => console.log('click', element);

const EmptyGraph = () => {
  const [elements, setElements] = useState([]);
  const onElementsRemove = (elementsToRemove) =>
    setElements(els => removeElements(elementsToRemove, els));
  const onConnect = (params) => setElements(els => addEdge(params, els));
  const addRandomNode = () => {
    const nodeId = (elements.length + 1).toString();
    const newNode = {
      id: nodeId,
      data: { label: `Node: ${nodeId}` },
      position: { x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight }
    };
    setElements(els => els.concat(newNode));
  };

  return (
    <Graph
      elements={elements}
      onLoad={onLoad}
      onElementClick={onElementClick}
      onElementsRemove={onElementsRemove}
      onConnect={p => onConnect(p)}
      onNodeDragStop={onNodeDragStop}
      style={{ width: '100%', height: '100%' }}
      backgroundType="lines"
    >
    <MiniMap />
    <Controls />
    <button
      type="button"
      onClick={addRandomNode}
      style={{ position: 'absolute', left: 10, top: 10, zIndex: 4 }}
    >
      add node
    </button>
    </Graph>
  );
}

export default EmptyGraph;

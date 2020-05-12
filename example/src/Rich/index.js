import React, { useState } from 'react';

import ReactFlow, { removeElements, addEdge, MiniMap, Controls } from 'react-flow-renderer';

const onNodeDragStop = node => console.log('drag stop', node);
const onElementClick = element => console.log('click', element);
const onLoad = (graph) => {
  console.log('graph loaded:', graph);
  graph.fitView();
};

const initialElements = [
  { id: '1', type: 'input', data: { label: 'Input Node 1' }, position: { x: 250, y: 5 } },
  { id: '2', data: { label: 'Node 2' }, position: { x: 150, y: 75 } },
  {
    id: '3', data: { label: 'Node 3 with custom style' }, position: { x: 250, y: 150 },
    style: { background: '#eee', color: '#222', border: '1px solid #bbb' },
    sourcePosition: 'right'
  },
  { id: '4', data: { label: 'Node 4' }, position: { x: 500, y: 200 }, targetPosition: 'left' },
  { id: '5', type: 'output', data: { label: 'Output Node 5' }, position: { x: 300, y: 300 } },
  { id: '6', type: 'output', data: { label: 'Output Node 6' }, position: { x: 600, y: 400 } },
  { id: 'e1-2', source: '1', target: '2', animated: true, label: 'edge text', labelBgStyle: { fillOpacity: 0.75 } },
  { id: 'e2-3', source: '2', target: '3', animated: true },
  { id: 'e3-4', source: '3', target: '4', animated: true },
  { id: 'e3-5', source: '4', target: '5', animated: true, type: 'step' },
  { id: 'e5-6b', source: '4', target: '6', type: 'step', label: 'styled label', labelStyle: { fill: 'red', fontWeight: 700 } },
]

const RichGraph = () => {
  const [elements, setElements] = useState(initialElements);

  const addRandomNode = () => {
    setElements(els => els.concat({
      id: (els.length + 1).toString(),
      data: { label: 'Added node' },
      position: { x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight }
    }));
  };
  const onElementsRemove = (elementsToRemove) => setElements(els => removeElements(elementsToRemove, els));
  const onConnect = (params) => setElements(els => addEdge(params, els));

  return (
    <ReactFlow
      elements={elements}
      onElementClick={onElementClick}
      onElementsRemove={onElementsRemove}
      onConnect={onConnect}
      onNodeDragStop={onNodeDragStop}
      style={{ width: '100%', height: '100%' }}
      onLoad={onLoad}
      connectionLineStyle={{ stroke: '#ddd', strokeWidth: 2 }}
      connectionLineType="bezier"
      backgroundColor="#888"
      backgroundGap={16}
      snapToGrid={true}
      snapGrid={[16, 16]}
    >
      <MiniMap
        nodeColor={n => {
          if (n.type === 'input') return 'blue';
          if (n.type === 'output') return 'green';
          if (n.type === 'default') return 'red';

          return '#FFCC00';
        }}
      />
      <Controls />
      <button
        type="button"
        onClick={addRandomNode}
        style={{ position: 'absolute', right: 10, top: 30, zIndex: 4 }}
        className="richexample__add"
      >
        add node
      </button>
    </ReactFlow>
  );
}

export default RichGraph;
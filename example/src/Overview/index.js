import React, { useState } from 'react';

import ReactFlow, { removeElements, addEdge, MiniMap, Controls, Background } from 'react-flow-renderer';

const onNodeDragStart = node => console.log('drag start', node);
const onNodeDragStop = node => console.log('drag stop', node);
const onElementClick = element => console.log('click', element);
const onSelectionChange = elements => console.log('selection change', elements);
const onLoad = (graph) => {
  console.log('graph loaded:', graph);
  graph.fitView();
};

const initialElements = [
  { id: '1', type: 'input', data: { label: <>Welcome to <strong>React Flow!</strong></> }, position: { x: 250, y: 0 } },
  { id: '2', data: { label: <>This is a <strong>default node</strong></> }, position: { x: 100, y: 100 } },
  {
    id: '3', data: { label: <>This one has a <strong>custom style</strong></> }, position: { x: 400, y: 100 },
    style: { background: '#eee', color: '#222', border: '1px solid #bbb', width: 180 },
  },
  {
    id: '4', position: { x: 250, y: 200 },
    data: { label: <>You can find the docs on <a href="https://github.com/wbkd/react-flow" target="_blank" rel="noopener noreferrer">Github</a></> }
  },
  { id: '5', data: { label: <>Or check out the other <strong>examples</strong></> }, position: { x: 250, y: 300 } },
  { id: '6', type: 'output', data: { label: <>An <strong>output node</strong></> }, position: { x: 100, y: 450 } },
  { id: '7', type: 'output', data: { label: 'Another output node' }, position: { x: 400, y: 450 } },
  { id: 'e1-2', source: '1', target: '2', label: 'this is an edge label' },
  { id: 'e1-3', source: '1', target: '3' },
  { id: 'e3-4', source: '3', target: '4', animated: true, label: 'animated edge' },
  { id: 'e4-5', source: '4', target: '5', },
  { id: 'e5-6', source: '5', target: '6', },
  { id: 'e5-7', source: '5', target: '7', type: 'step', label: 'a step edge', labelStyle: { fill: 'red', fontWeight: 700 } },
];

const OverviewFlow = () => {
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
      onNodeDragStart={onNodeDragStart}
      onNodeDragStop={onNodeDragStop}
      onSelectionChange={onSelectionChange}
      style={{ width: '100%', height: '100%' }}
      onLoad={onLoad}
      connectionLineStyle={{ stroke: '#ddd', strokeWidth: 2 }}
      connectionLineType="bezier"
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
      <Background
        color="#888"
        gap={16}
      />

      <button
        type="button"
        onClick={addRandomNode}
        style={{ position: 'absolute', right: 10, top: 30, zIndex: 4 }}
        className="overview-example__add"
      >
        add node
      </button>
    </ReactFlow>
  );
}

export default OverviewFlow;
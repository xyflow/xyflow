import React, { useState } from 'react';

import ReactFlow, { removeElements, addEdge, MiniMap, Controls, Background } from 'react-flow-renderer';

import CustomEdge from './CustomEdge';

const onNodeDragStop = node => console.log('drag stop', node);
const onElementClick = element => console.log('click', element);
const onLoad = (graph) => graph.fitView();

const initialElements = [
  { id: '1', type: 'input', data: { label: 'Input 1' }, position: { x: 250, y: 0 } },
  { id: '2', data: { label: 'Node 2' }, position: { x: 150, y: 100 } },
  { id: '3', data: { label: 'Node 3' }, position: { x: 250, y: 200 } },
  { id: '4', data: { label: 'Node 4' }, position: { x: 400, y: 300 } },
  { id: '3a', data: { label: 'Node 3a' }, position: { x: 150, y: 300 } },
  { id: '5', data: { label: 'Node 5' }, position: { x: 250, y: 400 } },
  { id: '6', type: 'output', data: { label: 'Output 6' }, position: { x: 50, y: 550 } },
  { id: '7', type: 'output', data: { label: 'Output 7' }, position: { x: 250, y: 550 } },
  { id: '8', type: 'output', data: { label: 'Output 8' }, position: { x: 525, y: 600 } },
  { id: 'e1-2', source: '1', target: '2', label: 'bezier edge (default)' },
  { id: 'e2-3', source: '2', target: '3', type: 'step', label: 'step edge' },
  { id: 'e3-4', source: '3', target: '4', type: 'straight', label: 'straight edge' },
  { id: 'e3-3a', source: '3', target: '3a', type: 'straight', label: 'label only edge', style: { stroke: 'none' } },
  { id: 'e3-5', source: '4', target: '5', animated: true, label: 'animated styled edge', style: { stroke: 'red' } },
  { id: 'e5-6', source: '5', target: '6', label: 'styled label', labelStyle: { fill: 'red', fontWeight: 700 } },
  { id: 'e5-7', source: '5', target: '7', label: 'label with styled bg', labelBgStyle: { fill: '#eee', fillOpacity: 0.7 } },
  { id: 'e5-8', source: '5', target: '8', type: 'custom', label: 'custom edge' },
];

const EdgesFlow = () => {
  const [elements, setElements] = useState(initialElements);

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
      snapToGrid={true}
      edgeTypes={{
        custom: CustomEdge
      }}
    >
      <MiniMap />
      <Controls />
      <Background />
    </ReactFlow>
  );
}

export default EdgesFlow;
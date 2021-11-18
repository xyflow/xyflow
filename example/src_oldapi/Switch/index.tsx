import React, { useState, MouseEvent } from 'react';

import ReactFlow, { removeElements, addEdge, Node, FlowElement, Elements, Connection, Edge } from 'react-flow-renderer';

const onNodeDragStop = (_: MouseEvent, node: Node) => console.log('drag stop', node);
const onElementClick = (_: MouseEvent, element: FlowElement) => console.log('click', element);

const elementsA: Elements = [
  { id: '1a', type: 'input', data: { label: 'Node 1' }, position: { x: 250, y: 5 }, className: 'light' },
  { id: '2a', data: { label: 'Node 2' }, position: { x: 100, y: 100 }, className: 'light' },
  { id: '3a', data: { label: 'Node 3' }, position: { x: 400, y: 100 }, className: 'light' },
  { id: '4a', data: { label: 'Node 4' }, position: { x: 400, y: 200 }, className: 'light' },
  { id: 'e1-2', source: '1a', target: '2a' },
  { id: 'e1-3', source: '1a', target: '3a' },
];

const elementsB: Elements = [
  { id: 'inputb', type: 'input', data: { label: 'Input' }, position: { x: 300, y: 5 }, className: 'light' },
  { id: '1b', data: { label: 'Node 1' }, position: { x: 0, y: 100 }, className: 'light' },
  { id: '2b', data: { label: 'Node 2' }, position: { x: 200, y: 100 }, className: 'light' },
  { id: '3b', data: { label: 'Node 3' }, position: { x: 400, y: 100 }, className: 'light' },
  { id: '4b', data: { label: 'Node 4' }, position: { x: 600, y: 100 }, className: 'light' },

  { id: 'e1b', source: 'inputb', target: '1b' },
  { id: 'e2b', source: 'inputb', target: '2b' },
  { id: 'e3b', source: 'inputb', target: '3b' },
  { id: 'e4b', source: 'inputb', target: '4b' },
];

const BasicFlow = () => {
  const [elements, setElements] = useState<Elements>(elementsA);
  const onElementsRemove = (elementsToRemove: Elements) => setElements((els) => removeElements(elementsToRemove, els));
  const onConnect = (params: Connection | Edge) => setElements((els) => addEdge(params, els));

  return (
    <ReactFlow
      elements={elements}
      onElementClick={onElementClick}
      onElementsRemove={onElementsRemove}
      onConnect={onConnect}
      onNodeDragStop={onNodeDragStop}
    >
      <div style={{ position: 'absolute', right: 10, top: 10, zIndex: 4 }}>
        <button onClick={() => setElements(elementsA)} style={{ marginRight: 5 }}>
          flow a
        </button>
        <button onClick={() => setElements(elementsB)}>flow b</button>
      </div>
    </ReactFlow>
  );
};

export default BasicFlow;

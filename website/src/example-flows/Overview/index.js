import React, { useState } from 'react';

import ReactFlow, {
  removeElements,
  addEdge,
  MiniMap,
  Controls,
  Background,
  isNode,
} from 'react-flow-renderer';

const onNodeDragStart = (event, node) => console.log('drag start', node);
const onNodeDragStop = (event, node) => console.log('drag stop', node);
const onSelectionDrag = (event, nodes) => console.log('selection drag', nodes);
const onSelectionDragStart = (event, nodes) =>
  console.log('selection drag start', nodes);
const onSelectionDragStop = (event, nodes) =>
  console.log('selection drag stop', nodes);
const onSelectionContextMenu = (event, nodes) => {
  event.preventDefault();
  console.log('selection context menu', nodes);
};
const onElementClick = (event, element) =>
  console.log(`${isNode(element) ? 'node' : 'edge'} click:`, element);
const onSelectionChange = (elements) =>
  console.log('selection change', elements);
const onLoad = (reactFlowInstance) => {
  console.log('flow loaded:', reactFlowInstance);
  reactFlowInstance.fitView();
};

const onMoveEnd = (transform) => console.log('zoom/move end', transform);

const initialElements = [
  {
    id: 'overview-1',
    type: 'input',
    data: {
      label: (
        <>
          Welcome to <strong>React Flow!</strong>
        </>
      ),
    },
    position: { x: 250, y: 0 },
  },
  {
    id: 'overview-2',
    data: {
      label: (
        <>
          This is a <strong>default node</strong>
        </>
      ),
    },
    position: { x: 100, y: 100 },
  },
  {
    id: 'overview-3',
    data: {
      label: (
        <>
          This one has a <strong>custom style</strong>
        </>
      ),
    },
    position: { x: 400, y: 100 },
    style: {
      background: '#D6D5E6',
      color: '#333',
      border: '1px solid #222138',
      width: 180,
    },
  },
  {
    id: 'overview-4',
    position: { x: 250, y: 200 },
    data: {
      label: (
        <>
          You can find the docs on{' '}
          <a
            href="https://github.com/wbkd/react-flow"
            target="_blank"
            rel="noopener noreferrer"
          >
            Github
          </a>
        </>
      ),
    },
  },
  {
    id: 'overview-5',
    data: {
      label: (
        <>
          Or check out the other <strong>examples</strong>
        </>
      ),
    },
    position: { x: 250, y: 325 },
  },
  {
    id: 'overview-6',
    type: 'output',
    data: {
      label: (
        <>
          An <strong>output node</strong>
        </>
      ),
    },
    position: { x: 100, y: 480 },
  },
  {
    id: 'overview-7',
    type: 'output',
    data: { label: 'Another output node' },
    position: { x: 400, y: 450 },
  },
  {
    id: 'overview-e1-2',
    source: 'overview-1',
    target: 'overview-2',
    label: 'this is an edge label',
  },
  { id: 'overview-e1-3', source: 'overview-1', target: 'overview-3' },
  {
    id: 'overview-e3-4',
    source: 'overview-3',
    target: 'overview-4',
    animated: true,
    label: 'animated edge',
  },
  {
    id: 'overview-e4-5',
    source: 'overview-4',
    target: 'overview-5',
    arrowHeadType: 'arrowclosed',
    label: 'edge with arrow head',
  },
  {
    id: 'overview-e5-6',
    source: 'overview-5',
    target: 'overview-6',
    type: 'smoothstep',
    label: 'smooth step edge',
  },
  {
    id: 'overview-e5-7',
    source: 'overview-5',
    target: 'overview-7',
    type: 'step',
    style: { stroke: '#f6ab6c' },
    label: 'a step edge',
    animated: true,
    labelStyle: { fill: '#f6ab6c', fontWeight: 700 },
  },
];

const connectionLineStyle = { stroke: '#ddd' };
const snapGrid = [16, 16];

const OverviewFlow = () => {
  const [elements, setElements] = useState(initialElements);
  const onElementsRemove = (elementsToRemove) =>
    setElements((els) => removeElements(elementsToRemove, els));
  const onConnect = (params) => setElements((els) => addEdge(params, els));

  console.log('render overview');

  return (
    <ReactFlow
      elements={elements}
      onElementClick={onElementClick}
      onElementsRemove={onElementsRemove}
      onConnect={onConnect}
      onNodeDragStart={onNodeDragStart}
      onNodeDragStop={onNodeDragStop}
      onSelectionDragStart={onSelectionDragStart}
      onSelectionDrag={onSelectionDrag}
      onSelectionDragStop={onSelectionDragStop}
      onSelectionContextMenu={onSelectionContextMenu}
      onSelectionChange={onSelectionChange}
      onMoveEnd={onMoveEnd}
      onLoad={onLoad}
      connectionLineStyle={connectionLineStyle}
      snapToGrid={true}
      snapGrid={snapGrid}
      key="overview"
    >
      <MiniMap
        nodeColor={(n) => {
          if (n.style?.background) return n.style.background;
          if (n.type === 'input') return '#9999ff';
          if (n.type === 'output') return '#79c9b7';
          if (n.type === 'default') return '#ff6060';

          return '#eee';
        }}
      />
      <Controls />
      <Background color="#aaa" gap={16} />
    </ReactFlow>
  );
};

export default OverviewFlow;

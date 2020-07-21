import React, { useState } from 'react';

import ReactFlow, { addEdge, MiniMap, Controls } from 'react-flow-renderer';

const initialElements = [
  { id: '1', type: 'input', data: { label: 'Node 1' }, position: { x: 250, y: 5 } },
  { id: '2', data: { label: 'Node 2' }, position: { x: 100, y: 100 } },
  { id: '3', data: { label: 'Node 3' }, position: { x: 400, y: 100 } },
  { id: '4', data: { label: 'Node 4' }, position: { x: 400, y: 200 } },
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3' },
];

const onNodeDragStart = (node) => console.log('drag start', node);
const onNodeDragStop = (node) => console.log('drag stop', node);
const onElementClick = (element) => console.log('click', element);

const InteractionFlow = () => {
  const [elements, setElements] = useState(initialElements);
  const onConnect = (params) => setElements((els) => addEdge(params, els));

  const [isSelectable, setIsSelectable] = useState(false);
  const [isDraggable, setIsDraggable] = useState(false);
  const [isConnectable, setIsConnectable] = useState(false);
  const [zoomOnScroll, setZoomOnScroll] = useState(false);
  const [zoomOnDoubleClick, setZoomOnDoubleClick] = useState(false);

  return (
    <ReactFlow
      elements={elements}
      elementsSelectable={isSelectable}
      nodesConnectable={isConnectable}
      nodesDraggable={isDraggable}
      zoomOnScroll={zoomOnScroll}
      zoomOnDoubleClick={zoomOnDoubleClick}
      onConnect={onConnect}
      onElementClick={onElementClick}
      onNodeDragStart={onNodeDragStart}
      onNodeDragStop={onNodeDragStop}
    >
      <MiniMap />
      <Controls />

      <div style={{ position: 'absolute', left: 10, top: 10, zIndex: 4 }}>
        <div>
          <label htmlFor="draggable">
            draggable
            <input
              id="draggable"
              type="checkbox"
              checked={isDraggable}
              onChange={(evt) => setIsDraggable(evt.target.checked)}
              className="react-flow__draggable"
            />
          </label>
        </div>
        <div>
          <label htmlFor="connectable">
            connectable
            <input
              id="connectable"
              type="checkbox"
              checked={isConnectable}
              onChange={(evt) => setIsConnectable(evt.target.checked)}
              className="react-flow__connectable"
            />
          </label>
        </div>
        <div>
          <label htmlFor="selectable">
            selectable
            <input
              id="selectable"
              type="checkbox"
              checked={isSelectable}
              onChange={(evt) => setIsSelectable(evt.target.checked)}
              className="react-flow__selectable"
            />
          </label>
        </div>
        <div>
          <label htmlFor="zoomonscroll">
            zoom on scroll
            <input
              id="zoomonscroll"
              type="checkbox"
              checked={zoomOnScroll}
              onChange={(evt) => setZoomOnScroll(evt.target.checked)}
              className="react-flow__zoomonscroll"
            />
          </label>
        </div>
        <div>
          <label htmlFor="zoomondbl">
            zoom on double click
            <input
              id="zoomondbl"
              type="checkbox"
              checked={zoomOnDoubleClick}
              onChange={(evt) => setZoomOnDoubleClick(evt.target.checked)}
              className="react-flow__zoomondbl"
            />
          </label>
        </div>
      </div>
    </ReactFlow>
  );
};

export default InteractionFlow;

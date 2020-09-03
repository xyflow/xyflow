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

const onNodeDragStart = (event, node) => console.log('drag start', node);
const onNodeDragStop = (event, node) => console.log('drag stop', node);
const onElementClick = (event, element) => console.log('click', element);
const onPaneClick = (event) => console.log('onPaneClick', event);
const onPaneScroll = (event) => console.log('onPaneScroll', event);
const onPaneContextMenu = (event) => console.log('onPaneContextMenu', event);

const InteractionFlow = () => {
  const [elements, setElements] = useState(initialElements);
  const onConnect = (params) => setElements((els) => addEdge(params, els));

  const [isSelectable, setIsSelectable] = useState(false);
  const [isDraggable, setIsDraggable] = useState(false);
  const [isConnectable, setIsConnectable] = useState(false);
  const [zoomOnScroll, setZoomOnScroll] = useState(false);
  const [zoomOnDoubleClick, setZoomOnDoubleClick] = useState(false);
  const [paneMoveable, setPaneMoveable] = useState(true);
  const [captureZoomClick, setCaptureZoomClick] = useState(false);
  const [captureZoomScroll, setCaptureZoomScroll] = useState(false);
  const [captureElementClick, setCaptureElementClick] = useState(false);

  return (
    <ReactFlow
      elements={elements}
      elementsSelectable={isSelectable}
      nodesConnectable={isConnectable}
      nodesDraggable={isDraggable}
      zoomOnScroll={zoomOnScroll}
      zoomOnDoubleClick={zoomOnDoubleClick}
      onConnect={onConnect}
      onElementClick={captureElementClick ? onElementClick : undefined}
      onNodeDragStart={onNodeDragStart}
      onNodeDragStop={onNodeDragStop}
      paneMoveable={paneMoveable}
      onPaneClick={captureZoomClick ? onPaneClick : undefined}
      onPaneScroll={captureZoomScroll ? onPaneScroll : undefined}
      onPaneContextMenu={captureZoomClick ? onPaneContextMenu : undefined}
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
              onChange={(event) => setIsDraggable(event.target.checked)}
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
              onChange={(event) => setIsConnectable(event.target.checked)}
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
              onChange={(event) => setIsSelectable(event.target.checked)}
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
              onChange={(event) => setZoomOnScroll(event.target.checked)}
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
              onChange={(event) => setZoomOnDoubleClick(event.target.checked)}
              className="react-flow__zoomondbl"
            />
          </label>
        </div>
        <div>
          <label htmlFor="panemoveable">
            pane moveable
            <input
              id="panemoveable"
              type="checkbox"
              checked={paneMoveable}
              onChange={(event) => setPaneMoveable(event.target.checked)}
              className="react-flow__panemoveable"
            />
          </label>
        </div>
        <div>
          <label htmlFor="capturezoompaneclick">
            capture zoom pane click
            <input
              id="capturezoompaneclick"
              type="checkbox"
              checked={captureZoomClick}
              onChange={(event) => setCaptureZoomClick(event.target.checked)}
              className="react-flow__capturezoompaneclick"
            />
          </label>
        </div>
        <div>
          <label htmlFor="capturezoompanescroll">
            capture zoom pane scroll
            <input
              id="capturezoompanescroll"
              type="checkbox"
              checked={captureZoomScroll}
              onChange={(event) => setCaptureZoomScroll(event.target.checked)}
              className="react-flow__capturezoompanescroll"
            />
          </label>
        </div>
        <div>
          <label htmlFor="captureelementclick">
            capture element click
            <input
              id="captureelementclick"
              type="checkbox"
              checked={captureElementClick}
              onChange={(event) => setCaptureElementClick(event.target.checked)}
              className="react-flow__captureelementclick"
            />
          </label>
        </div>
      </div>
    </ReactFlow>
  );
};

export default InteractionFlow;

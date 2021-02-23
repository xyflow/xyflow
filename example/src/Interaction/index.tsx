import React, { useState, MouseEvent, WheelEvent } from 'react';
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Elements,
  Node,
  FlowElement,
  Connection,
  Edge,
  PanOnScrollMode,
  FlowTransform,
} from 'react-flow-renderer';

const initialElements: Elements = [
  { id: '1', type: 'input', data: { label: 'Node 1' }, position: { x: 250, y: 5 } },
  { id: '2', data: { label: 'Node 2' }, position: { x: 100, y: 100 } },
  { id: '3', data: { label: 'Node 3' }, position: { x: 400, y: 100 } },
  { id: '4', data: { label: 'Node 4' }, position: { x: 400, y: 200 } },
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3' },
];

const onNodeDragStart = (_: MouseEvent, node: Node) => console.log('drag start', node);
const onNodeDragStop = (_: MouseEvent, node: Node) => console.log('drag stop', node);
const onElementClick = (_: MouseEvent, element: FlowElement) => console.log('click', element);
const onPaneClick = (event: MouseEvent) => console.log('onPaneClick', event);
const onPaneScroll = (event?: WheelEvent) => console.log('onPaneScroll', event);
const onPaneContextMenu = (event: MouseEvent) => console.log('onPaneContextMenu', event);
const onMoveEnd = (flowTranasform?: FlowTransform) => console.log('onMoveEnd', flowTranasform);

const InteractionFlow = () => {
  const [elements, setElements] = useState<Elements>(initialElements);
  const onConnect = (params: Connection | Edge) => setElements((els) => addEdge(params, els));

  const [isSelectable, setIsSelectable] = useState<boolean>(false);
  const [isDraggable, setIsDraggable] = useState<boolean>(false);
  const [isConnectable, setIsConnectable] = useState<boolean>(false);
  const [zoomOnScroll, setZoomOnScroll] = useState<boolean>(false);
  const [zoomOnPinch, setZoomOnPinch] = useState<boolean>(false);
  const [panOnScroll, setPanOnScroll] = useState<boolean>(false);
  const [panOnScrollMode, setPanOnScrollMode] = useState<PanOnScrollMode>(PanOnScrollMode.Free);
  const [zoomOnDoubleClick, setZoomOnDoubleClick] = useState<boolean>(false);
  const [paneMoveable, setPaneMoveable] = useState<boolean>(true);
  const [captureZoomClick, setCaptureZoomClick] = useState<boolean>(false);
  const [captureZoomScroll, setCaptureZoomScroll] = useState<boolean>(false);
  const [captureElementClick, setCaptureElementClick] = useState<boolean>(false);

  return (
    <ReactFlow
      elements={elements}
      elementsSelectable={isSelectable}
      nodesConnectable={isConnectable}
      nodesDraggable={isDraggable}
      zoomOnScroll={zoomOnScroll}
      zoomOnPinch={zoomOnPinch}
      panOnScroll={panOnScroll}
      panOnScrollMode={panOnScrollMode}
      zoomOnDoubleClick={zoomOnDoubleClick}
      onConnect={onConnect}
      onElementClick={captureElementClick ? onElementClick : undefined}
      onNodeDragStart={onNodeDragStart}
      onNodeDragStop={onNodeDragStop}
      paneMoveable={paneMoveable}
      onPaneClick={captureZoomClick ? onPaneClick : undefined}
      onPaneScroll={captureZoomScroll ? onPaneScroll : undefined}
      onPaneContextMenu={captureZoomClick ? onPaneContextMenu : undefined}
      onMoveEnd={onMoveEnd}
    >
      <MiniMap />
      <Controls />

      <div style={{ position: 'absolute', left: 10, top: 10, zIndex: 4 }}>
        <div>
          <label htmlFor="draggable">
            nodesDraggable
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
            nodesConnectable
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
            elementsSelectable
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
            zoomOnScroll
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
          <label htmlFor="zoomonpinch">
            zoomOnPinch
            <input
              id="zoomonpinch"
              type="checkbox"
              checked={zoomOnPinch}
              onChange={(event) => setZoomOnPinch(event.target.checked)}
              className="react-flow__zoomonpinch"
            />
          </label>
        </div>
        <div>
          <label htmlFor="panonscroll">
            panOnScroll
            <input
              id="panonscroll"
              type="checkbox"
              checked={panOnScroll}
              onChange={(event) => setPanOnScroll(event.target.checked)}
              className="react-flow__panonscroll"
            />
          </label>
        </div>
        <div>
          <label htmlFor="panonscrollmode">
            panOnScrollMode
            <select
              id="panonscrollmode"
              value={panOnScrollMode}
              onChange={(event) => setPanOnScrollMode(event.target.value as PanOnScrollMode)}
              className="react-flow__panonscrollmode"
            >
              <option value="free">free</option>
              <option value="horizontal">horizontal</option>
              <option value="vertical">vertical</option>
            </select>
          </label>
        </div>
        <div>
          <label htmlFor="zoomondbl">
            zoomOnDoubleClick
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
            paneMoveable
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
            capture onPaneClick
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
            capture onPaneScroll
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
            capture onElementClick
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

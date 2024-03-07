import { useState, MouseEvent as ReactMouseEvent, WheelEvent } from 'react';
import {
  ReactFlow,
  addEdge,
  Node,
  Connection,
  Edge,
  PanOnScrollMode,
  Viewport,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
} from '@xyflow/react';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Node 1' },
    position: { x: 250, y: 5 },
  },
  { id: '2', data: { label: 'Node 2' }, position: { x: 100, y: 100 } },
  { id: '3', data: { label: 'Node 3' }, position: { x: 400, y: 100 } },
  { id: '4', data: { label: 'Node 4' }, position: { x: 400, y: 200 } },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3' },
];

const onNodeDragStart = (_: ReactMouseEvent, node: Node) => console.log('drag start', node);
const onNodeDragStop = (_: ReactMouseEvent, node: Node) => console.log('drag stop', node);
const onNodeClick = (_: ReactMouseEvent, node: Node) => console.log('click', node);
const onEdgeClick = (_: ReactMouseEvent, edge: Edge) => console.log('click', edge);
const onPaneClick = (event: ReactMouseEvent) => console.log('onPaneClick', event);
const onPaneScroll = (event?: WheelEvent) => console.log('onPaneScroll', event);
const onPaneContextMenu = (event: ReactMouseEvent | MouseEvent) => console.log('onPaneContextMenu', event);
const onMoveEnd = (_: TouchEvent | MouseEvent | null, viewport: Viewport) => console.log('onMoveEnd', viewport);

const InteractionFlow = () => {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect = (params: Connection | Edge) => setEdges((els) => addEdge(params, els));

  const [isSelectable, setIsSelectable] = useState<boolean>(false);
  const [isDraggable, setIsDraggable] = useState<boolean>(false);
  const [isConnectable, setIsConnectable] = useState<boolean>(false);
  const [zoomOnScroll, setZoomOnScroll] = useState<boolean>(false);
  const [zoomOnPinch, setZoomOnPinch] = useState<boolean>(false);
  const [panOnScroll, setPanOnScroll] = useState<boolean>(false);
  const [panOnScrollMode, setPanOnScrollMode] = useState<PanOnScrollMode>(PanOnScrollMode.Free);
  const [zoomOnDoubleClick, setZoomOnDoubleClick] = useState<boolean>(false);
  const [panOnDrag, setPanOnDrag] = useState<boolean>(true);
  const [captureZoomClick, setCaptureZoomClick] = useState<boolean>(false);
  const [captureZoomScroll, setCaptureZoomScroll] = useState<boolean>(false);
  const [captureElementClick, setCaptureElementClick] = useState<boolean>(false);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      elementsSelectable={isSelectable}
      nodesConnectable={isConnectable}
      nodesDraggable={isDraggable}
      zoomOnScroll={zoomOnScroll}
      zoomOnPinch={zoomOnPinch}
      panOnScroll={panOnScroll}
      panOnScrollMode={panOnScrollMode}
      zoomOnDoubleClick={zoomOnDoubleClick}
      onConnect={onConnect}
      onNodeClick={captureElementClick ? onNodeClick : undefined}
      onEdgeClick={captureElementClick ? onEdgeClick : undefined}
      onNodeDragStart={onNodeDragStart}
      onNodeDragStop={onNodeDragStop}
      panOnDrag={panOnDrag}
      onPaneClick={captureZoomClick ? onPaneClick : undefined}
      onPaneScroll={captureZoomScroll ? onPaneScroll : undefined}
      onPaneContextMenu={captureZoomClick ? onPaneContextMenu : undefined}
      nodeDragThreshold={0}
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
          <label htmlFor="panondrag">
            panOnDrag
            <input
              id="panondrag"
              type="checkbox"
              checked={panOnDrag}
              onChange={(event) => setPanOnDrag(event.target.checked)}
              className="react-flow__panondrag"
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

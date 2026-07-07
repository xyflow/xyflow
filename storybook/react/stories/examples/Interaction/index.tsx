import { MouseEvent as ReactMouseEvent, WheelEvent } from 'react';
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

export type InteractionExampleProps = {
  elementsSelectable?: boolean;
  nodesDraggable?: boolean;
  nodesConnectable?: boolean;
  zoomOnScroll?: boolean;
  zoomOnPinch?: boolean;
  panOnScroll?: boolean;
  panOnScrollMode?: PanOnScrollMode;
  zoomOnDoubleClick?: boolean;
  panOnDrag?: boolean;
  captureZoomClick?: boolean;
  captureZoomScroll?: boolean;
  captureElementClick?: boolean;
};

export function InteractionExample({
  elementsSelectable = false,
  nodesDraggable = false,
  nodesConnectable = false,
  zoomOnScroll = false,
  zoomOnPinch = false,
  panOnScroll = false,
  panOnScrollMode = PanOnScrollMode.Free,
  zoomOnDoubleClick = false,
  panOnDrag = true,
  captureZoomClick = false,
  captureZoomScroll = false,
  captureElementClick = false,
}: InteractionExampleProps) {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect = (params: Connection | Edge) => setEdges((els) => addEdge(params, els));

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      elementsSelectable={elementsSelectable}
      nodesConnectable={nodesConnectable}
      nodesDraggable={nodesDraggable}
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
    </ReactFlow>
  );
}

export default InteractionExample;

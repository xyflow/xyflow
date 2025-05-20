import { MouseEvent as ReactMouseEvent, CSSProperties, useCallback } from 'react';
import {
  ReactFlow,
  addEdge,
  Node,
  Viewport,
  SnapGrid,
  Connection,
  Edge,
  ReactFlowInstance,
  useNodesState,
  useEdgesState,
  OnSelectionChangeParams,
  Controls,
  Background,
  MiniMap,
  ConnectionMode,
  OnBeforeDelete,
  OnDelete,
} from '@xyflow/react';

const onNodeDragStart = (_: ReactMouseEvent, node: Node, nodes: Node[]) => console.log('drag start', node, nodes);
const onNodeDrag = (_: ReactMouseEvent, node: Node, nodes: Node[]) => console.log('drag', node, nodes);
const onNodeDragStop = (_: ReactMouseEvent, node: Node, nodes: Node[]) => console.log('drag stop', node, nodes);
const onNodeDoubleClick = (_: ReactMouseEvent, node: Node) => console.log('node double click', node);
const onPaneClick = (event: ReactMouseEvent) => console.log('pane click', event);
const onPaneScroll = (event?: ReactMouseEvent) => console.log('pane scroll', event);
const onPaneContextMenu = (event: ReactMouseEvent | MouseEvent) => console.log('pane context menu', event);
const onSelectionDrag = (_: ReactMouseEvent, nodes: Node[]) => console.log('selection drag', nodes);
const onSelectionDragStart = (_: ReactMouseEvent, nodes: Node[]) => console.log('selection drag start', nodes);
const onSelectionDragStop = (_: ReactMouseEvent, nodes: Node[]) => console.log('selection drag stop', nodes);
const onSelectionContextMenu = (event: ReactMouseEvent, nodes: Node[]) => {
  event.preventDefault();
  console.log('selection context menu', nodes);
};
const onNodeClick = (_: ReactMouseEvent, node: Node) => console.log('node click:', node);

const onSelectionChange = ({ nodes, edges }: OnSelectionChangeParams) => console.log('selection change', nodes, edges);
const onInit = (reactFlowInstance: ReactFlowInstance) => {
  console.log('pane ready:', reactFlowInstance);
};

const onMoveStart = (_: MouseEvent | TouchEvent | null, viewport: Viewport) => console.log('zoom/move start', viewport);
const onMoveEnd = (_: MouseEvent | TouchEvent | null, viewport: Viewport) => console.log('zoom/move end', viewport);
const onEdgeContextMenu = (_: ReactMouseEvent, edge: Edge) => console.log('edge context menu', edge);
const onEdgeMouseEnter = (_: ReactMouseEvent, edge: Edge) => console.log('edge mouse enter', edge);
const onEdgeMouseMove = (_: ReactMouseEvent, edge: Edge) => console.log('edge mouse move', edge);
const onEdgeMouseLeave = (_: ReactMouseEvent, edge: Edge) => console.log('edge mouse leave', edge);
const onEdgeDoubleClick = (_: ReactMouseEvent, edge: Edge) => console.log('edge double click', edge);
const onBeforeDelete: OnBeforeDelete = async ({ nodes, edges }) => {
  console.log('on before delete', nodes, edges);
  const deleteElements = confirm('Do you want to remove the selected elements?');
  return deleteElements;
};
const onDelete: OnDelete = ({ nodes, edges }) => console.log('on delete', nodes, edges);
const onPaneMouseMove = (e: ReactMouseEvent) => console.log('pane move', e.clientX, e.clientY);

const initialNodes: Node[] = [
  {
    id: '1',
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
    id: '2',
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
    id: '3',
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
    id: '4',
    position: { x: 250, y: 200 },
    data: {
      label: (
        <>
          You can find the docs on{' '}
          <a href="https://github.com/wbkd/react-flow" target="_blank" rel="noopener noreferrer">
            Github
          </a>
        </>
      ),
    },
  },
  {
    id: '5',
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
    id: '6',
    type: 'output',
    data: {
      label: (
        <>
          An <strong>output node (not deletable)</strong>
        </>
      ),
    },
    position: { x: 100, y: 480 },
    deletable: false,
  },
  {
    id: '7',
    type: 'output',
    data: { label: 'Another output node' },
    position: { x: 400, y: 450 },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', label: 'this is an edge label' },
  { id: 'e1-3', source: '1', target: '3' },
  {
    id: 'e3-4',
    source: '3',
    target: '4',
    animated: true,
    label: 'animated edge',
  },
  { id: 'e4-5', source: '4', target: '5', label: 'edge with arrow head' },
  {
    id: 'e5-6',
    source: '5',
    target: '6',
    type: 'smoothstep',
    deletable: false,
    label: 'smooth step edge (not deletable)',
  },
  {
    id: 'e5-7',
    source: '5',
    target: '7',
    type: 'step',
    style: { stroke: '#f6ab6c' },
    label: 'a step edge',
    animated: true,
    labelStyle: { fill: '#f6ab6c', fontWeight: 700 },
  },
];

const connectionLineStyle: CSSProperties = { stroke: '#ddd' };
const snapGrid: SnapGrid = [25, 25];

const nodeStrokeColor = (n: Node): string => {
  if (n.style?.background) return n.style.background as string;
  if (n.type === 'input') return '#0041d0';
  if (n.type === 'output') return '#ff0072';
  if (n.type === 'default') return '#1a192b';

  return '#eee';
};

const nodeColor = (n: Node): string => {
  if (n.style?.background) return n.style.background as string;

  return '#fff';
};

const OverviewFlow = () => {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect = useCallback((params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      connectionMode={ConnectionMode.Strict}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onNodeClick={onNodeClick}
      onConnect={onConnect}
      onPaneClick={onPaneClick}
      onPaneScroll={onPaneScroll}
      onPaneContextMenu={onPaneContextMenu}
      onNodeDragStart={onNodeDragStart}
      onNodeDrag={onNodeDrag}
      onNodeDragStop={onNodeDragStop}
      onNodeDoubleClick={onNodeDoubleClick}
      onSelectionDragStart={onSelectionDragStart}
      onSelectionDrag={onSelectionDrag}
      onSelectionDragStop={onSelectionDragStop}
      onSelectionContextMenu={onSelectionContextMenu}
      onSelectionChange={onSelectionChange}
      onMoveStart={onMoveStart}
      onMoveEnd={onMoveEnd}
      onInit={onInit}
      connectionLineStyle={connectionLineStyle}
      snapToGrid={true}
      snapGrid={snapGrid}
      onEdgeContextMenu={onEdgeContextMenu}
      onEdgeMouseEnter={onEdgeMouseEnter}
      onEdgeMouseMove={onEdgeMouseMove}
      onEdgeMouseLeave={onEdgeMouseLeave}
      onEdgeDoubleClick={onEdgeDoubleClick}
      fitView
      fitViewOptions={{ padding: 0.1 /*nodes: [{ id: '1' }]*/ }}
      attributionPosition="top-right"
      maxZoom={Infinity}
      onBeforeDelete={onBeforeDelete}
      onDelete={onDelete}
      onPaneMouseMove={onPaneMouseMove}
    >
      <MiniMap nodeBorderRadius={2} />
      <Controls orientation="horizontal" />
      <Background gap={25} />
    </ReactFlow>
  );
};

export default OverviewFlow;

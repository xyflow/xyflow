import { MouseEvent, useCallback } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  MiniMap,
  addEdge,
  Connection,
  Edge,
  EdgeTypes,
  MarkerType,
  Node,
  useEdgesState,
  useNodesState,
} from '@xyflow/react';

import CustomEdge from './CustomEdge';
import CustomEdge2 from './CustomEdge2';
import CustomEdge3 from './CustomEdge3';

const onNodeDragStop = (_: MouseEvent, node: Node) => console.log('drag stop', node);
const onNodeClick = (_: MouseEvent, node: Node) => console.log('click', node);
const onEdgeClick = (_: MouseEvent, edge: Edge) => console.log('click', edge);
const onEdgeDoubleClick = (_: MouseEvent, edge: Edge) => console.log('dblclick', edge);
const onEdgeMouseEnter = (_: MouseEvent, edge: Edge) => console.log('enter', edge);
const onEdgeMouseMove = (_: MouseEvent, edge: Edge) => console.log('move', edge);
const onEdgeMouseLeave = (_: MouseEvent, edge: Edge) => console.log('leave', edge);

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Input 1' },
    position: { x: 250, y: 0 },
  },
  { id: '2', data: { label: 'Node 2' }, position: { x: 150, y: 100 } },
  { id: '2a', data: { label: 'Node 2a' }, position: { x: 0, y: 180 } },
  { id: '2b', data: { label: 'Node 2b' }, position: { x: -40, y: 300 } },
  { id: '3', data: { label: 'Node 3' }, position: { x: 250, y: 200 } },
  { id: '4', data: { label: 'Node 4' }, position: { x: 400, y: 300 } },
  { id: '3a', data: { label: 'Node 3a' }, position: { x: 150, y: 300 } },
  { id: '5', data: { label: 'Node 5' }, position: { x: 250, y: 400 } },
  {
    id: '6',
    type: 'output',
    data: { label: 'Output 6' },
    position: { x: 50, y: 550 },
  },
  {
    id: '7',
    type: 'output',
    data: { label: 'Output 7' },
    position: { x: 250, y: 550 },
  },
  {
    id: '8',
    type: 'output',
    data: { label: 'Output 8' },
    position: { x: 525, y: 600 },
  },
  {
    id: '9',
    type: 'output',
    data: { label: 'Output 9' },
    position: { x: 675, y: 500 },
  },
  {
    id: '10',
    type: 'output',
    data: { label: 'Output 10' },
    position: { x: 50, y: 400 },
  },
  {
    id: '11',
    type: 'output',
    data: { label: 'Output 11' },
    position: { x: 825, y: 400 },
  },
  {
    id: '12',
    type: 'output',
    data: { label: 'Output 12' },
    position: { x: 825, y: 300 },
  },
  {
    id: '13',
    type: 'output',
    data: { label: 'Output 13' },
    position: { x: 900, y: 200 },
  },
  {
    id: '14',
    type: 'output',
    data: { label: 'Output 14' },
    position: { x: 825, y: 100 },
  },
];

const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    label: 'bezier edge (default)',
    className: 'normal-edge',
  },
  {
    id: 'e2-2a',
    source: '2',
    target: '2a',
    type: 'smoothstep',
    label: 'smoothstep edge',
  },
  {
    id: 'e2a-2b',
    source: '2a',
    target: '2b',
    type: 'simplebezier',
    label: 'simple bezier edge',
  },
  { id: 'e2-3', source: '2', target: '3', type: 'step', label: 'step edge' },
  {
    id: 'e3-4',
    source: '3',
    target: '4',
    type: 'straight',
    label: 'straight edge',
  },
  {
    id: 'e3-3a',
    source: '3',
    target: '3a',
    type: 'straight',
    label: 'label only edge',
    style: { stroke: 'none' },
  },
  {
    id: 'e3-5',
    source: '4',
    target: '5',
    animated: true,
    label: 'animated styled edge',
    style: { stroke: 'red' },
  },
  {
    id: 'e5-7',
    source: '5',
    target: '7',
    label: 'label with styled bg',
    labelBgPadding: [8, 4],
    labelBgBorderRadius: 4,
    labelBgStyle: { fill: '#FFCC00', color: '#fff', fillOpacity: 0.7 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
  {
    id: 'e5-8',
    source: '5',
    target: '8',
    type: 'custom',
    data: { text: 'custom edge' },
  },
  {
    id: 'e5-9',
    source: '5',
    target: '9',
    type: 'custom2',
    data: { text: 'custom edge 2' },
  },
  {
    id: 'e3a-10',
    source: '3a',
    target: '10',
    type: 'custom3',
    data: { text: 'custom edge 3' },
  },
  {
    id: 'e5-6',
    source: '5',
    target: '6',
    label: (
      <>
        <tspan>i am using</tspan>
        <tspan dy={10} x={0}>
          {'<tspan>'}
        </tspan>
      </>
    ),
    labelStyle: { fill: 'red', fontWeight: 700 },
    style: { stroke: '#ffcc00' },
    markerEnd: {
      type: MarkerType.Arrow,
      color: '#FFCC00',
      markerUnits: 'userSpaceOnUse',
      width: 20,
      height: 20,
      strokeWidth: 2,
    },
    markerStart: {
      type: MarkerType.ArrowClosed,
      color: '#FFCC00',
      orient: 'auto-start-reverse',
      markerUnits: 'userSpaceOnUse',
      width: 20,
      height: 20,
    },
  },
  {
    id: 'e4-11',
    source: '4',
    target: '11',
    label: 'Explicit Blue Prop Color (should override CSS)',
    className: 'css-variable-edge',
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#0000ff',
      width: 40,
      height: 40,
    },
  },
  {
    id: 'e4-12',
    source: '4',
    target: '12',
    label: 'Marker explicitly undefined Color (defaults to none)',
    className: 'css-variable-edge',
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: undefined,
      width: 40,
      height: 40,
    },
  },
  {
    id: 'e4-13',
    source: '4',
    target: '13',
    label: 'Marker null Color (should use `--xy-edge-stroke` CSS variable)',
    className: 'css-variable-edge',
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: null,
      width: 40,
      height: 40,
    },
  },
  {
    id: 'e4-14',
    source: '4',
    target: '14',
    label: 'Marker implicitly undefined Color (defaults to defaultMarkerColor)',
    className: 'css-variable-edge',
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 40,
      height: 40,
    },
  },
];

const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
  custom2: CustomEdge2,
  custom3: CustomEdge3,
};

const defaultEdgeOptions = {
  markerEnd: {
    type: MarkerType.Arrow,
    color: 'red',
    width: 20,
    height: 20,
  },
};

const EdgesFlow = () => {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect = useCallback((params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  return (
    <>
      <style>
        {`
          /* Test CSS variables on specific edges */
          .react-flow {
            --xy-edge-stroke-width: 1;
            --xy-edge-stroke: #00ff00;
          }

        `}
      </style>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        snapToGrid={true}
        edgeTypes={edgeTypes}
        onEdgeClick={onEdgeClick}
        onEdgeDoubleClick={onEdgeDoubleClick}
        onEdgeMouseEnter={onEdgeMouseEnter}
        onEdgeMouseMove={onEdgeMouseMove}
        onEdgeMouseLeave={onEdgeMouseLeave}
        onDelete={console.log}
        defaultEdgeOptions={defaultEdgeOptions}
        defaultMarkerColor={'purple'}
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </>
  );
};

export default EdgesFlow;

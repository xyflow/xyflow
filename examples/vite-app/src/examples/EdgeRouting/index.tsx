import { ReactFlow, Node, Edge, Position, MarkerType } from '@xyflow/react';

const nodes: Node[] = [
  // LTR
  {
    id: '1',
    position: { x: 50, y: -100 },
    data: { label: 'Source' },
    sourcePosition: Position.Right,
    targetPosition: Position.Right,
    style: { background: 'rgba(255,255,255,0.5)' },
  },
  {
    id: '2',
    position: { x: -100, y: 0 },
    data: { label: 'Target' },
    sourcePosition: Position.Left,
    targetPosition: Position.Left,
    style: { background: 'rgba(255,255,255,0.5)' },
  },
  // Right Right
  {
    id: '3',
    position: { x: -100, y: 250 },
    data: { label: 'Source' },
    sourcePosition: Position.Right,
    targetPosition: Position.Right,
    style: { background: 'rgba(255,255,255,0.5)' },
  },
  {
    id: '4',
    position: { x: 50, y: 150 },
    data: { label: 'Target' },
    sourcePosition: Position.Right,
    targetPosition: Position.Right,
    style: { background: 'rgba(255,255,255,0.5)' },
  },
  // Right Top
  {
    id: '5',
    position: { x: -100, y: 450 },
    data: { label: 'Source' },
    sourcePosition: Position.Right,
    targetPosition: Position.Right,
    style: { background: 'rgba(255,255,255,0.5)' },
  },
  {
    id: '6',
    position: { x: 100, y: 400 },
    data: { label: 'Target' },
    sourcePosition: Position.Top,
    targetPosition: Position.Top,
    style: { background: 'rgba(255,255,255,0.5)' },
  },
  // Right Bottom
  {
    id: '7',
    position: { x: 100, y: 700 },
    data: { label: 'Source' },
    sourcePosition: Position.Right,
    targetPosition: Position.Right,
    style: { background: 'rgba(255,255,255,0.5)' },
  },
  {
    id: '8',
    position: { x: -100, y: 600 },
    data: { label: 'Target' },
    sourcePosition: Position.Bottom,
    targetPosition: Position.Bottom,
    style: { background: 'rgba(255,255,255,0.5)' },
  },
];

const edges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    pathOptions: {
      offset: 30,
    },
    interactionWidth: 0,
  },
  {
    id: 'e3-4',
    source: '3',
    target: '4',
    pathOptions: {
      borderRadius: 2,
    },
    interactionWidth: 0,
  },

  {
    id: 'e4-5',
    source: '5',
    target: '6',
  },

  {
    id: 'e7-8',
    source: '7',
    target: '8',
  },
];

const defaultEdgeOptions = {
  label: 'Edge Label',
  type: 'smoothstep',
  markerEnd: {
    type: MarkerType.ArrowClosed,
  },
  style: {
    strokeWidth: 1,
  },
};

const SimpleEdge = () => {
  return <ReactFlow defaultNodes={nodes} defaultEdges={edges} fitView defaultEdgeOptions={defaultEdgeOptions} />;
};

export default SimpleEdge;

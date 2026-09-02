import { Node, Edge, XYPosition, MarkerType } from '@xyflow/react';

const position: XYPosition = { x: 0, y: 0 };

const nodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'input' },
    position,
  },
  {
    id: '2',
    data: { label: 'node 2' },
    position,
  },
  {
    id: '2a',
    data: { label: 'node 2a' },
    position,
  },
  {
    id: '2b',
    data: { label: 'node 2b' },
    position,
  },
  {
    id: '2c',
    data: { label: 'node 2c' },
    position,
  },
  {
    id: '2d',
    data: { label: 'node 2d' },
    position,
  },
  {
    id: '3',
    data: { label: 'node 3' },
    position,
  },
  {
    id: '4',
    data: { label: 'node 4' },
    position,
  },
  {
    id: '5',
    data: { label: 'node 5' },
    position,
  },
  {
    id: '6',
    type: 'output',
    data: { label: 'output' },
    position,
  },
  {
    id: '7',
    type: 'output',
    data: { label: 'output' },
    position: { x: 400, y: 450 },
  },
];

const edges: Edge[] = [
  {
    id: 'e12',
    source: '1',
    target: '2',
    type: 'smoothstep',
    markerEnd: { type: MarkerType.Arrow },
  },
  {
    id: 'e13',
    source: '1',
    target: '3',
    type: 'smoothstep',
    markerEnd: { type: MarkerType.Arrow },
  },
  {
    id: 'e22a',
    source: '2',
    target: '2a',
    type: 'smoothstep',
    markerEnd: { type: MarkerType.Arrow },
  },
  {
    id: 'e22b',
    source: '2',
    target: '2b',
    type: 'smoothstep',
    markerEnd: { type: MarkerType.Arrow },
  },
  {
    id: 'e22c',
    source: '2',
    target: '2c',
    type: 'smoothstep',
    markerEnd: { type: MarkerType.Arrow },
  },
  {
    id: 'e2c2d',
    source: '2c',
    target: '2d',
    type: 'smoothstep',
    markerEnd: { type: MarkerType.Arrow },
  },

  {
    id: 'e45',
    source: '4',
    target: '5',
    type: 'smoothstep',
    markerEnd: { type: MarkerType.Arrow },
  },
  {
    id: 'e56',
    source: '5',
    target: '6',
    type: 'smoothstep',
    markerEnd: { type: MarkerType.Arrow },
  },
  {
    id: 'e57',
    source: '5',
    target: '7',
    type: 'smoothstep',
    markerEnd: { type: MarkerType.Arrow },
  },
];

const nodesAndEdges = { nodes, edges };

export default nodesAndEdges;

import { Node, Edge } from '@xyflow/react';

export const nodes: Node[] = [
  {
    id: '1',
    data: { label: 'Node 1' },
    position: { x: 0, y: 0 },
  },
  {
    id: '2',
    data: { label: 'Node 2' },
    position: { x: 200, y: 200 },
  },
];

export const edges: Edge[] = [
  {
    id: 'e1',
    source: '1',
    target: '2',
  },
];

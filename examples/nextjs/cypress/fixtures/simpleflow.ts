import { Node, Edge } from '@react-flow/bundle';

export const nodes: Node[] = [
  {
    id: '1',
    data: { label: 'Node 1' },
    position: { x: 250, y: 5 },
  },
  {
    id: '2',
    data: { label: 'Node 2' },
    position: { x: 100, y: 100 },
  },
];

export const edges: Edge[] = [
  {
    id: 'e1',
    source: '1',
    target: '2',
  },
];

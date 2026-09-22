import type { SharedNode, SharedEdge } from '../../types';
export const initialNodes: SharedNode[] = [
  {
    id: '1',
    data: { label: 'Node 1', toolbarPosition: 'top' },
    position: { x: 0, y: 0 },
  },
  {
    id: '2',
    data: { label: 'Node 2', toolbarPosition: 'top' },
    position: { x: 100, y: 150 },
  },
  {
    id: '3',
    data: { label: 'Node 3', toolbarPosition: 'top' },
    position: { x: 200, y: 0 },
  },
];

export const initialEdges: SharedEdge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    type: 'custom',
    data: { type: 'smoothstep', align: ['left', 'bottom'] },
  },
  {
    id: 'e3-2',
    source: '3',
    target: '2',
    type: 'custom',
    data: { type: 'bezier', align: ['right', 'bottom'] },
  },
  {
    id: 'e1-3',
    source: '1',
    target: '3',
    type: 'custom',
    data: { type: 'straight', align: ['center', 'center'] },
  },
];

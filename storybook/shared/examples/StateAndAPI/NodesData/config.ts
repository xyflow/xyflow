import type { SharedNode, SharedEdge } from '../../../types';
export const initialNodes: SharedNode[] = [
  {
    id: '1',
    type: 'text',
    data: {
      text: 'hello',
    },
    position: { x: -100, y: -50 },
  },
  {
    id: '1a',
    type: 'uppercase',
    data: { text: '' },
    position: { x: 100, y: 0 },
  },
  {
    id: '1b',
    type: 'uppercase',
    data: { text: '' },
    position: { x: 100, y: -100 },
  },
  {
    id: '2',
    type: 'text',
    data: {
      text: 'world',
    },
    position: { x: 0, y: 100 },
  },
  {
    id: '3a',
    type: 'result',
    data: {},
    position: { x: 300, y: -75 },
  },
  {
    id: '3b',
    type: 'result',
    data: {},
    position: { x: 300, y: 50 },
  },
];

export const initialEdges: SharedEdge[] = [
  {
    id: 'e1-1a',
    source: '1',
    target: '1a',
  },
  {
    id: 'e1a-3a',
    source: '1b',
    target: '3a',
  },
  {
    id: 'e1-1b',
    source: '1',
    target: '1b',
  },
  {
    id: 'e1a-3b',
    source: '1a',
    target: '3b',
  },
  {
    id: 'e2-3b',
    source: '2',
    target: '3b',
  },
];

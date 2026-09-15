import type { SharedNode } from '../../../types';
export const initialNodes: SharedNode[] = [
  { id: '0', type: 'custominput', position: { x: 0, y: 150 }, data: {} },
  { id: 'A', type: 'customnode', position: { x: 250, y: 0 }, data: {} },
  { id: 'B', type: 'customnode', position: { x: 250, y: 150 }, data: {} },
  { id: 'C', type: 'customnode', position: { x: 250, y: 300 }, data: {} },
];

export const isValidConnection = (connection: { target: string | null }) => connection.target === 'B';

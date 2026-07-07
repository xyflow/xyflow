import type { SharedFlowConfig } from '../types';

const nodeDefaults = {
  sourcePosition: 'right',
  targetPosition: 'left',
};

const nodes = [
  { id: 'A', type: 'input', position: { x: 0, y: 150 }, data: { label: 'A' }, ...nodeDefaults },
  { id: 'B', position: { x: 250, y: 0 }, data: { label: 'B' }, ...nodeDefaults },
  { id: 'C', position: { x: 250, y: 150 }, data: { label: 'C' }, ...nodeDefaults },
  { id: 'D', position: { x: 250, y: 300 }, data: { label: 'D' }, ...nodeDefaults },
];

const edges = [
  { id: 'A-B', source: 'A', target: 'B' },
  { id: 'A-C', source: 'A', target: 'C' },
  { id: 'A-D', source: 'A', target: 'D' },
];

export const colorModeReactConfig = {
  flowProps: {
    fitView: true,
    nodes,
    edges,
  },
} satisfies SharedFlowConfig;

export const colorModeSvelteConfig = {
  flowProps: {
    fitView: true,
    nodes: nodes.map(({ type, ...node }) => ({
      ...node,
      ...(type ? { type } : {}),
    })),
    edges,
  },
} satisfies SharedFlowConfig;

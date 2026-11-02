const nodes = [
  {
    id: 'keep-a',
    data: { label: 'keep-a' },
    position: { x: 0, y: 0 },
  },
  {
    id: 'skip',
    data: { label: 'skip' },
    position: { x: 200, y: 0 },
  },
  {
    id: 'keep-b',
    data: { label: 'keep-b' },
    position: { x: 400, y: 0 },
  },
];

export default {
  flowProps: {
    fitView: true,
    nodes,
    edges: [],
    isNodeSelectable: () => true,
  },
} satisfies FlowConfig;

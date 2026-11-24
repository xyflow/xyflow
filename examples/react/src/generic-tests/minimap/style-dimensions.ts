export default {
  flowProps: {
    nodes: [
      { id: 'a', data: { label: 'a' }, position: { x: 0, y: 0 } },
      { id: 'b', data: { label: 'b' }, position: { x: 400, y: 300 } },
    ],
    edges: [],
  },
  minimapProps: {
    style: { width: '240px', height: '180px' },
  },
} satisfies FlowConfig;

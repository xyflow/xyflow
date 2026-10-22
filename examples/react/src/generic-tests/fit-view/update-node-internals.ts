import UpdateInternalsNode from './components/UpdateInternalsNode';

export default {
  withProvider: true,
  flowProps: {
    fitView: true,
    nodeTypes: {
      UpdateInternalsNode,
    },
    nodes: [
      {
        id: 'update-internals',
        data: { label: 'update-internals' },
        position: { x: 0, y: 0 },
        type: 'UpdateInternalsNode',
      },
      {
        id: 'far',
        data: { label: 'far' },
        position: { x: 2000, y: 1200 },
      },
    ],
    edges: [],
  },
} satisfies FlowConfig;

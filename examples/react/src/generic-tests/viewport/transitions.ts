import ViewportTransitionsNode from './components/ViewportTransitionsNode';

export default {
  flowProps: {
    fitView: true,
    nodeTypes: {
      ViewportTransitionsNode,
    },
    nodes: [
      {
        id: 'transitions',
        type: 'ViewportTransitionsNode',
        data: {},
        position: { x: 0, y: 0 },
      },
      {
        id: 'target',
        data: { label: 'target' },
        position: { x: 1500, y: 1000 },
      },
    ],
    edges: [],
  },
} satisfies FlowConfig;

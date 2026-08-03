export default {
  flowProps: {
    nodes: [
      {
        id: 'source',
        data: { label: 'Source' },
        position: { x: 0, y: 0 },
        type: 'input',
      },
      {
        id: 'target',
        data: { label: 'Target' },
        position: { x: 200, y: 0 },
      },
    ],
    edges: [
      {
        id: 'missing-handle',
        source: 'source',
        sourceHandle: 'missing',
        target: 'target',
      },
    ],
    onError: (code) => console.info(`react-flow-error:${code}`),
  },
} satisfies FlowConfig;

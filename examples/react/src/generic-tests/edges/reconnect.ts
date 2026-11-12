export default {
  flowProps: {
    fitView: true,
    multiSelectionKeyCode: 's',
    deleteKeyCode: 'd',
    nodes: [
      {
        id: 'rc-1',
        data: { label: '1' },
        position: { x: 0, y: 0 },
        type: 'input',
      },
      {
        id: 'rc-2',
        data: { label: '2' },
        position: { x: 0, y: 200 },
        type: 'input',
      },
      {
        id: 'rc-3',
        data: { label: '3' },
        position: { x: 250, y: 100 },
      },
      {
        id: 'rc-4',
        data: { label: '4' },
        position: { x: 250, y: 400 },
      },
    ],
    edges: [
      {
        id: 'reconnect-1',
        source: 'rc-1',
        target: 'rc-3',
        reconnectable: true,
      },
      {
        id: 'reconnect-2',
        source: 'rc-2',
        target: 'rc-3',
        reconnectable: true,
      },
      {
        id: 'reconnect-3',
        source: 'rc-1',
        target: 'rc-4',
        reconnectable: true,
        zIndex: 5,
      },
    ],
  },
} satisfies FlowConfig;

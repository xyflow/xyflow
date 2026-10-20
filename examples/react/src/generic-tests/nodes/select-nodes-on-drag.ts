export default {
  flowProps: {
    fitView: true,
    selectNodesOnDrag: false,
    nodeDragThreshold: 0,
    multiSelectionKeyCode: 's',
    nodes: [
      {
        id: 'Node-1',
        data: { label: 'Node-1' },
        position: { x: 0, y: 0 },
      },
      {
        id: 'Node-2',
        data: { label: 'Node-2' },
        position: { x: 100, y: 100 },
      },
      {
        id: 'Node-3',
        data: { label: 'Node-3' },
        position: { x: 200, y: 0 },
      },
    ],
    edges: [
      {
        id: 'first-edge',
        source: 'Node-1',
        target: 'Node-2',
      },
    ],
  },
} satisfies FlowConfig;

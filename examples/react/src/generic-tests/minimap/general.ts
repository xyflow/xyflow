export default {
  flowProps: {
    fitView: true,
    nodes: [
      {
        id: 'minimap-a',
        data: { label: 'A' },
        position: { x: -200, y: -80 },
        style: { backgroundColor: '#dbeafe' },
      },
      {
        id: 'minimap-b',
        data: { label: 'B' },
        position: { x: 80, y: 120 },
        style: { backgroundColor: '#dcfce7' },
      },
    ],
    edges: [
      {
        id: 'minimap-a-b',
        source: 'minimap-a',
        target: 'minimap-b',
      },
    ],
  },
  minimapProps: {
    position: 'bottom-right',
    nodeStrokeColor: '#334155',
    nodeStrokeWidth: 3,
    maskColor: 'rgba(148, 163, 184, 0.28)',
    ariaLabel: 'Test minimap',
  },
} satisfies FlowConfig;

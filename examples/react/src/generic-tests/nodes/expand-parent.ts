export default {
  flowProps: {
    nodes: [
      {
        id: 'outer',
        type: 'group',
        position: { x: 450, y: 450 },
        origin: [0.5, 0.5],
        style: { width: 300, height: 300 },
        data: {},
      },
      {
        id: 'parent',
        parentId: 'outer',
        type: 'group',
        position: { x: 125, y: 125 },
        origin: [0.5, 0.5],
        style: { width: 150, height: 150 },
        expandParent: true,
        data: {},
      },
      {
        id: 'child',
        parentId: 'parent',
        position: { x: 48, y: 72 },
        origin: [0.2, 0.8],
        style: { width: 40, height: 40, padding: 0 },
        expandParent: true,
        data: { label: 'Drag' },
      },
      {
        id: 'sibling',
        parentId: 'parent',
        position: { x: 10, y: 10 },
        style: { width: 20, height: 20, padding: 0 },
        data: { label: '' },
      },
    ],
    edges: [],
  },
} satisfies FlowConfig;

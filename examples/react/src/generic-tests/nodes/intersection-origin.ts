import IntersectionOriginNode from './components/IntersectionOriginNode';

export default {
  flowProps: {
    fitView: true,
    nodeOrigin: [0.5, 0.5],
    nodeTypes: { intersectionOrigin: IntersectionOriginNode },
    nodes: [
      { id: 'root', position: { x: 100, y: 100 }, width: 100, height: 100, data: { label: 'root' } },
      {
        id: 'own-origin',
        position: { x: 300, y: 300 },
        width: 100,
        height: 100,
        origin: [0, 0],
        data: { label: 'own origin' },
      },
      { id: 'parent', position: { x: 500, y: 500 }, width: 200, height: 200, data: { label: 'parent' } },
      {
        id: 'child',
        parentId: 'parent',
        position: { x: 50, y: 50 },
        width: 50,
        height: 50,
        data: { label: 'child' },
      },
      {
        id: 'probe',
        type: 'intersectionOrigin',
        position: { x: 0, y: 700 },
        width: 300,
        data: {},
      },
    ],
    edges: [],
  },
} satisfies FlowConfig;

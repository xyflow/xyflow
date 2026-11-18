import IntersectionsProbeNode from './components/IntersectionsProbeNode';

export default {
  flowProps: {
    nodeTypes: { intersectionsProbe: IntersectionsProbeNode },
    nodes: [
      {
        id: 'probe',
        type: 'intersectionsProbe',
        data: {},
        position: { x: 0, y: 0 },
        selectable: false,
        draggable: false,
        style: { pointerEvents: 'all' },
      },
      { id: 'target', data: { label: 'target' }, position: { x: 0, y: 150 } },
      { id: 'overlapping', data: { label: 'overlapping' }, position: { x: 50, y: 170 } },
      { id: 'far', data: { label: 'far' }, position: { x: 600, y: 150 } },
      // hidden nodes are not rendered, so they are never measured and have no size
      { id: 'hidden', data: { label: 'hidden' }, position: { x: 1000, y: 1000 }, hidden: true },
    ],
    edges: [],
  },
} satisfies FlowConfig;

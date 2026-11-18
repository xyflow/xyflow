import ResizableChildNode from './components/ResizableChildNode';

export default {
  flowProps: {
    snapToGrid: true,
    snapGrid: [20, 20],
    nodeTypes: { resizableChild: ResizableChildNode },
    nodes: [
      {
        id: 'parent',
        type: 'group',
        data: {},
        position: { x: 100, y: 100 },
        style: { width: 400, height: 300 },
      },
      {
        id: 'child',
        type: 'resizableChild',
        data: {},
        parentId: 'parent',
        expandParent: true,
        position: { x: 20, y: 20 },
        style: { width: 100, height: 60 },
      },
    ],
    edges: [],
  },
} satisfies FlowConfig;

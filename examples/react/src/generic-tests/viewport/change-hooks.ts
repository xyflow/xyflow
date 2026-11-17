import ViewportChangeHookNode from './components/ViewportChangeHookNode';

export default {
  flowProps: {
    nodeTypes: { viewportChangeHook: ViewportChangeHookNode },
    nodes: [
      {
        id: 'probe',
        type: 'viewportChangeHook',
        data: {},
        position: { x: 0, y: 0 },
        selectable: false,
        draggable: false,
        style: { pointerEvents: 'all' },
      },
    ],
    edges: [],
  },
} satisfies FlowConfig;

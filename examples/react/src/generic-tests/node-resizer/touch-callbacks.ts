import TouchResizeNode from './TouchResizeNode';

export default {
  flowProps: {
    nodeTypes: { touchResize: TouchResizeNode },
    nodes: [
      {
        id: 'resizable',
        type: 'touchResize',
        position: { x: 150, y: 100 },
        width: 130,
        height: 100,
        data: {},
      },
    ],
    edges: [],
  },
} satisfies FlowConfig;

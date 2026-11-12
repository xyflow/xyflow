import NodesDataUpdatesNode from './components/NodesDataUpdatesNode';

export default {
  flowProps: {
    nodeTypes: { dataUpdates: NodesDataUpdatesNode },
    nodes: [
      {
        id: 'probe',
        type: 'dataUpdates',
        data: {},
        position: { x: 0, y: 0 },
        selectable: false,
        draggable: false,
        style: { pointerEvents: 'all' },
      },
      { id: 'a', data: { value: 'initial' }, position: { x: 0, y: 150 } },
      { id: 'b', data: {}, position: { x: 200, y: 150 } },
    ],
    edges: [],
  },
} satisfies FlowConfig;

import ConnectionUpdatesNode from './components/ConnectionUpdatesNode';

export default {
  flowProps: {
    nodeTypes: { connectionUpdates: ConnectionUpdatesNode },
    nodes: [
      {
        id: 'probe',
        type: 'connectionUpdates',
        data: {},
        position: { x: 0, y: 0 },
        selectable: false,
        draggable: false,
        style: { pointerEvents: 'all' },
      },
      { id: 'a', data: {}, position: { x: 0, y: 150 } },
      { id: 'b', data: {}, position: { x: 200, y: 150 } },
      { id: 'c', data: {}, position: { x: 400, y: 150 } },
    ],
    edges: [{ id: 'ab', source: 'a', target: 'b' }],
  },
} satisfies FlowConfig;

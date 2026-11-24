import ObservedNodeConnectionsNode from './components/ObservedNodeConnectionsNode';

export default {
  flowProps: {
    nodeTypes: { observedNodeConnections: ObservedNodeConnectionsNode },
    nodes: [
      {
        id: 'probe',
        type: 'observedNodeConnections',
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
    edges: [
      { id: 'ab', source: 'a', target: 'b' },
      { id: 'bc', source: 'b', target: 'c' },
    ],
  },
} satisfies FlowConfig;

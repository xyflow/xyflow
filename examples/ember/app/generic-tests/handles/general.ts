import CustomHandleNode from './components/custom-handle-node';
import type { FlowConfig } from '../types';

export default {
  flowProps: {
    fitView: true,
    autoPanOnConnect: false,
    nodeTypes: {
      CustomHandleNode,
    },
    nodes: [
      {
        id: 'custom-source',
        type: 'CustomHandleNode',
        data: { label: 'source' },
        position: { x: 0, y: 0 },
        className: 'ember-flow__node-default',
      },
      {
        id: 'custom-target',
        type: 'CustomHandleNode',
        data: { label: 'target' },
        position: { x: 250, y: 0 },
        className: 'ember-flow__node-default',
      },
      {
        id: 'custom-disabled',
        type: 'CustomHandleNode',
        data: { label: 'disabled' },
        position: { x: 250, y: 140 },
        connectable: false,
        className: 'ember-flow__node-default',
      },
    ],
    edges: [],
  },
} satisfies FlowConfig;

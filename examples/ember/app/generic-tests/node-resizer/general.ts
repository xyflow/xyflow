import ResizableNode from './components/resizable-node';
import type { FlowConfig } from '../types';

export default {
  flowProps: {
    fitView: true,
    nodeTypes: {
      ResizableNode,
    },
    nodes: [
      {
        id: 'resizable',
        type: 'ResizableNode',
        data: { label: 'Resizable' },
        position: { x: 0, y: 0 },
        width: 160,
        height: 80,
        selected: true,
        className: 'ember-flow__node-default resizable-test-node',
      },
      {
        id: 'target',
        data: { label: 'Target' },
        position: { x: 300, y: 30 },
        targetPosition: 'left',
      },
    ],
    edges: [
      {
        id: 'resizable-target',
        source: 'resizable',
        target: 'target',
      },
    ],
  },
} satisfies FlowConfig;

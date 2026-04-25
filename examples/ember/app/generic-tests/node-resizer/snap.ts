import ResizableNode from './components/resizable-node';
import type { FlowConfig } from '../types';

export default {
  flowProps: {
    fitView: false,
    initialViewport: { x: 0, y: 0, zoom: 1 },
    snapToGrid: true,
    snapGrid: [50, 50],
    nodeTypes: {
      ResizableNode,
    },
    nodes: [
      {
        id: 'snap-resizable',
        type: 'ResizableNode',
        data: { label: 'Snap resize' },
        position: { x: 100, y: 100 },
        width: 160,
        height: 80,
        selected: true,
        className: 'ember-flow__node-default resizable-test-node',
      },
    ],
    edges: [],
  },
} satisfies FlowConfig;

import type { FlowConfig } from '../types';

export default {
  flowProps: {
    fitView: false,
    initialViewport: { x: 0, y: 0, zoom: 1 },
    nodes: [
      {
        id: 'focusable-node',
        data: { label: 'focusable-node' },
        position: { x: 80, y: 100 },
      },
      {
        id: 'unfocusable-node',
        data: { label: 'unfocusable-node' },
        position: { x: 360, y: 100 },
        focusable: false,
      },
      {
        id: 'edge-target',
        data: { label: 'edge-target' },
        position: { x: 220, y: 260 },
      },
    ],
    edges: [
      {
        id: 'focusable-edge',
        source: 'focusable-node',
        target: 'edge-target',
      },
      {
        id: 'unfocusable-edge',
        source: 'unfocusable-node',
        target: 'edge-target',
        focusable: false,
      },
    ],
  },
} satisfies FlowConfig;

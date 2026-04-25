import type { FlowConfig } from '../types';

export default {
  flowProps: {
    fitView: false,
    initialViewport: { x: 0, y: 0, zoom: 1 },
    nodeDragThreshold: 0,
    autoPanOnConnect: false,
    autoPanOnNodeDrag: false,
    snapToGrid: true,
    snapGrid: [50, 50],
    nodes: [
      {
        id: 'snap-node',
        data: { label: 'snap-node' },
        position: { x: 100, y: 100 },
        width: 100,
        height: 50,
      },
      {
        id: 'origin-node',
        data: { label: 'origin-node' },
        position: { x: 400, y: 200 },
        width: 100,
        height: 60,
        origin: [0.5, 0.5],
      },
      {
        id: 'extent-node',
        data: { label: 'extent-node' },
        position: { x: 200, y: 260 },
        width: 120,
        height: 60,
        extent: [
          [150, 250],
          [330, 380],
        ],
      },
    ],
    edges: [
      {
        id: 'snap-to-origin',
        source: 'snap-node',
        target: 'origin-node',
      },
    ],
  },
} satisfies FlowConfig;

import type { FlowConfig } from '../types';

export default {
  flowProps: {
    fitView: false,
    initialViewport: { x: 0, y: 0, zoom: 1 },
    nodeDragThreshold: 0,
    autoPanOnConnect: true,
    autoPanOnNodeDrag: false,
    autoPanSpeed: 20,
    nodes: [
      {
        id: 'source',
        type: 'output',
        data: { label: 'source' },
        position: { x: 120, y: 260 },
      },
      {
        id: 'target',
        type: 'input',
        data: { label: 'target' },
        position: { x: 920, y: 260 },
      },
    ],
    edges: [],
  },
} satisfies FlowConfig;

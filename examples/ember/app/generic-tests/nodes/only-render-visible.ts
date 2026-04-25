import type { FlowConfig } from '../types';

export default {
  flowProps: {
    fitView: false,
    initialViewport: { x: 0, y: 0, zoom: 1 },
    onlyRenderVisibleElements: true,
    nodes: [
      {
        id: 'visible',
        data: { label: 'visible' },
        position: { x: 120, y: 120 },
      },
      {
        id: 'offscreen',
        data: { label: 'offscreen' },
        position: { x: 5000, y: 5000 },
      },
      {
        id: 'offscreen-target',
        data: { label: 'offscreen target' },
        position: { x: 5300, y: 5200 },
      },
      {
        id: 'edge-visible-source',
        data: { label: 'edge source' },
        position: { x: -220, y: 260 },
      },
      {
        id: 'edge-visible-target',
        data: { label: 'edge target' },
        position: { x: 1120, y: 260 },
      },
    ],
    edges: [
      {
        id: 'visible-crossing-edge',
        source: 'edge-visible-source',
        target: 'edge-visible-target',
      },
      {
        id: 'offscreen-edge',
        source: 'offscreen',
        target: 'offscreen-target',
      },
    ],
  },
} satisfies FlowConfig;

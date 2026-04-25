import ConnectionLine from '../../components/parity-samples/connection-line';
import type { FlowConfig } from '../types';

export default {
  flowProps: {
    fitView: false,
    initialViewport: { x: 0, y: 0, zoom: 1 },
    connectionLineComponent: ConnectionLine,
    connectionDragThreshold: 1,
    nodes: [
      {
        id: 'source',
        data: { label: 'source' },
        position: { x: 120, y: 160 },
      },
      {
        id: 'target',
        data: { label: 'target' },
        position: { x: 520, y: 280 },
      },
    ],
    edges: [],
  },
} satisfies FlowConfig;

import { ConnectionLineType } from '@xyflow/ember';

import type { FlowConfig } from '../types';

export default {
  flowProps: {
    fitView: false,
    initialViewport: { x: 0, y: 0, zoom: 1 },
    connectionLineType: ConnectionLineType.Step,
    connectionLineStyle: 'stroke: rgb(0, 128, 128); stroke-width: 3;',
    connectionLineContainerStyle: 'opacity: 0.75;',
    nodes: [
      {
        id: 'source',
        type: 'output',
        data: { label: 'source' },
        position: { x: 120, y: 160 },
      },
      {
        id: 'target',
        type: 'input',
        data: { label: 'target' },
        position: { x: 520, y: 280 },
      },
    ],
    edges: [],
  },
} satisfies FlowConfig;


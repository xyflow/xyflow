import { SelectionMode } from '@xyflow/ember';

import type { FlowConfig } from '../types';

export default {
  flowProps: {
    fitView: false,
    initialViewport: { x: 240, y: 160, zoom: 1 },
    panOnDrag: false,
    selectionOnDrag: true,
    selectionMode: SelectionMode.Full,
    nodes: [
      {
        id: 'inside',
        data: { label: 'inside' },
        position: { x: 120, y: 120 },
      },
      {
        id: 'partial',
        data: { label: 'partial' },
        position: { x: 320, y: 120 },
      },
    ],
    edges: [],
  },
} satisfies FlowConfig;


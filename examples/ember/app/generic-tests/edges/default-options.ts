import { MarkerType } from '@xyflow/ember';

import type { FlowConfig } from '../types';

export default {
  flowProps: {
    fitView: true,
    defaultEdgeOptions: {
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed },
      style: 'stroke: rgb(180, 0, 180);',
      label: 'default edge',
      interactionWidth: 42,
    },
    nodes: [
      {
        id: 'source',
        type: 'input',
        data: { label: 'source' },
        position: { x: 0, y: 0 },
      },
      {
        id: 'target',
        data: { label: 'target' },
        position: { x: 220, y: 120 },
      },
    ],
    edges: [
      {
        id: 'defaulted-edge',
        source: 'source',
        target: 'target',
      },
    ],
  },
} satisfies FlowConfig;


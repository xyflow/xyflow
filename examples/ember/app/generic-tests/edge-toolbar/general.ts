import { Position } from '@xyflow/ember';

import type { FlowConfig } from '../types';

export default {
  flowProps: {
    fitView: true,
    nodes: [
      {
        id: 'source',
        data: { label: 'Source' },
        position: { x: 0, y: 0 },
        sourcePosition: Position.Right,
      },
      {
        id: 'target',
        data: { label: 'Target' },
        position: { x: 280, y: 60 },
        targetPosition: Position.Left,
      },
    ],
    edges: [
      {
        id: 'source-target',
        source: 'source',
        target: 'target',
        selected: true,
        label: 'toolbar edge',
      },
    ],
  },
  edgeToolbarProps: {
    edgeId: 'source-target',
    position: Position.Top,
    offset: 16,
  },
} satisfies FlowConfig;

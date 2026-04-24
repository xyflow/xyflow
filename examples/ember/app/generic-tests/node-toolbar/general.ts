import { Position } from '@xyflow/ember';

import ToolbarNode from './components/toolbar-node';
import type { FlowConfig } from '../types';
import type { Node } from '@xyflow/ember';

const positions = ['top', 'right', 'bottom', 'left'] as const;
const alignments = ['start', 'center', 'end'] as const;

const nodes: Node[] = [
  {
    id: 'default-node',
    type: 'ToolbarNode',
    data: { label: 'toolbar top', toolbarPosition: Position.Top },
    position: { x: -200, y: -200 },
    className: 'ember-flow__node-default',
  },
];

positions.forEach((position, posIndex) => {
  alignments.forEach((align, alignIndex) => {
    let id = `node-${align}-${position}`;

    nodes.push({
      id,
      type: 'ToolbarNode',
      data: {
        label: `toolbar ${position} ${align}`,
        toolbarPosition: position,
        toolbarAlign: align,
        toolbarVisible: true,
      },
      className: 'ember-flow__node-default',
      position: { x: posIndex * 300, y: alignIndex * 100 },
    });
  });
});

export default {
  flowProps: {
    fitView: true,
    nodeTypes: {
      ToolbarNode,
    },
    nodes,
    edges: [
      {
        id: 'first-edge',
        source: 'default-node',
        target: 'node-start-top',
      },
    ],
  },
} satisfies FlowConfig;

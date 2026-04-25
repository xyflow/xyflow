import { Position } from '@xyflow/ember';

import ToolbarNode from './components/toolbar-node';
import type { FlowConfig } from '../types';
import type { Node } from '@xyflow/ember';

const positions = ['top', 'right', 'bottom', 'left'] as const;
const alignments = ['start', 'center', 'end'] as const;
const columnGap = 330;
const rowGap = 150;

const nodes: Node[] = [
  {
    id: 'default-node',
    type: 'ToolbarNode',
    data: { label: 'toolbar top', toolbarPosition: Position.Top },
    position: { x: -300, y: -240 },
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
      position: { x: posIndex * columnGap, y: alignIndex * rowGap },
    });
  });
});

export default {
  flowProps: {
    fitView: true,
    fitViewOptions: { padding: 0.35 },
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

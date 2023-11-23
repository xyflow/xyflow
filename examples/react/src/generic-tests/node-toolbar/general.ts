import { Position, type Node } from '@xyflow/react';
import ToolbarNode from './components/ToolbarNode';

const positions = ['top', 'right', 'bottom', 'left'];
const alignments = ['start', 'center', 'end'];

const nodes: Node[] = [
  {
    id: 'default-node',
    type: 'ToolbarNode',
    data: { label: 'toolbar top', toolbarPosition: Position.Top },
    position: { x: 0, y: -200 },
    className: 'react-flow__node-default',
  },
];

positions.forEach((position, posIndex) => {
  alignments.forEach((align, alignIndex) => {
    const id = `node-${align}-${position}`;
    nodes.push({
      id,
      type: 'ToolbarNode',
      data: {
        label: `toolbar ${position} ${align}`,
        toolbarPosition: position as Position,
        toolbarAlign: align,
        toolbarVisible: true,
      },
      className: 'react-flow__node-default',
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

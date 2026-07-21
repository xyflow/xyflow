import type { SharedFlowConfig, SharedNode } from '../../types';

const positions = ['top', 'right', 'bottom', 'left'] as const;
const alignments = ['start', 'center', 'end'] as const;

export const nodeToolbarNodes: SharedNode[] = [
  {
    id: 'default-node',
    type: 'ToolbarNode',
    data: { label: 'toolbar top', toolbarPosition: 'top' },
    position: { x: 0, y: -200 },
    className: 'react-flow__node-default',
  },
];

positions.forEach((position, posIndex) => {
  alignments.forEach((align, alignIndex) => {
    nodeToolbarNodes.push({
      id: `node-${align}-${position}`,
      type: 'ToolbarNode',
      data: {
        label: `toolbar ${position} ${align}`,
        toolbarPosition: position,
        toolbarAlign: align,
        toolbarVisible: true,
      },
      className: 'react-flow__node-default',
      position: { x: posIndex * 300, y: alignIndex * 100 },
    });
  });
});

export const nodeToolbarReactConfig = {
  flowProps: {
    fitView: true,
    nodes: nodeToolbarNodes,
    edges: [{ id: 'first-edge', source: 'default-node', target: 'node-start-top' }],
  },
} satisfies SharedFlowConfig;

export const nodeToolbarSvelteConfig = {
  flowProps: {
    fitView: true,
    nodes: nodeToolbarNodes.map(({ className, ...node }) => ({
      ...node,
      ...(className ? { class: className } : {}),
    })),
    edges: [{ id: 'first-edge', source: 'default-node', target: 'node-start-top' }],
  },
} satisfies SharedFlowConfig;

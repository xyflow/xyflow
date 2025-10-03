const positions = ['top', 'right', 'bottom', 'left'];
const alignments = ['start', 'center', 'end'];

const nodes: any[] = [
  {
    id: 'default-node',
    data: { label: 'toolbar top' },
    position: { x: 0, y: -200 },
    className: 'angular-flow__node-default',
  },
];

positions.forEach((position, posIndex) => {
  alignments.forEach((align, alignIndex) => {
    const id = `node-${align}-${position}`;
    nodes.push({
      id,
      data: {
        label: `toolbar ${position} ${align}`,
      },
      className: 'angular-flow__node-default',
      position: { x: posIndex * 300, y: alignIndex * 100 },
    });
  });
});

const flowConfig = {
  flowProps: {
    fitView: true,
    nodes,
    edges: [
      {
        id: 'first-edge',
        source: 'default-node',
        target: 'node-start-top',
      },
    ],
  },
};

export default flowConfig;
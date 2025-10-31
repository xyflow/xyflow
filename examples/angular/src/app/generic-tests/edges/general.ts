const flowConfig = {
  flowProps: {
    fitView: true,
    nodes: [
      {
        id: '1',
        data: { label: '1' },
        position: { x: 0, y: 0 },
        type: 'input',
      },
      {
        id: '2',
        data: { label: '2' },
        position: { x: -100, y: 100 },
      },
      {
        id: '3',
        data: { label: '3' },
        position: { x: 100, y: 100 },
      },
      {
        id: '4',
        data: { label: '4' },
        position: { x: -100, y: 200 },
      },
      {
        id: '5',
        data: { label: '5' },
        position: { x: 100, y: 200 },
      },
      {
        id: '6',
        data: { label: '6' },
        position: { x: -100, y: 300 },
      },
      {
        id: '7',
        data: { label: '7' },
        position: { x: 100, y: 300 },
      },
      {
        id: '8',
        data: { label: '8' },
        position: { x: -100, y: 400 },
      },
      {
        id: '9',
        data: { label: '9' },
        position: { x: 100, y: 400 },
      },
      {
        id: '10',
        data: { label: '10' },
        position: { x: -100, y: 500 },
      },
      {
        id: '11',
        data: { label: '11' },
        position: { x: 100, y: 500 },
      },
    ],
    edges: [
      {
        id: 'edge-with-class',
        source: '1',
        target: '2',
        className: 'edge-class-test',
      },
      {
        id: 'edge-with-style',
        source: '1',
        target: '3',
        style: { stroke: 'red' },
      },
      {
        id: 'hidden-edge',
        source: '2',
        target: '4',
        label: 'hidden',
        hidden: true,
      },
      {
        id: 'animated-edge',
        source: '3',
        target: '5',
        label: 'animated',
        animated: true,
      },
      {
        id: 'not-selectable-edge',
        source: '4',
        target: '6',
        label: 'not-selectable',
        selectable: false,
      },
      {
        id: 'not-deletable',
        source: '5',
        target: '7',
        label: 'not-deletable',
        deletable: false,
      },
    ],
  },
};

export default flowConfig;
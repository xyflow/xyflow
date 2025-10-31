import type { Node, Edge } from '@xyflow/angular';

const flowConfig = {
  flowProps: {
    fitView: true,
    deleteKey: 'd',
    nodeDragThreshold: 0,
    nodes: [
      {
        id: 'Node-1',
        data: { label: 'Node-1' },
        position: { x: 0, y: 0 },
        type: 'input',
        className: 'playwright-test-class-123 angular-flow__node',
        style: { backgroundColor: 'red' },
      },
      {
        id: 'Node-2',
        type: 'output',
        data: { label: 'Node-2' },
        position: { x: -100, y: 100 },
      },
      {
        id: 'Node-3',
        data: { label: 'Node-3' },
        position: { x: 100, y: 100 },
      },
      {
        id: 'Node-4',
        data: { label: 'Node-4' },
        position: { x: 0, y: 200 },
        type: 'output',
      },
      {
        id: 'notConnectable',
        type: 'output',
        data: { label: 'notConnectable' },
        position: { x: 0, y: 300 },
        connectable: false,
      },
      {
        id: 'notDraggable',
        data: { label: 'notDraggable' },
        position: { x: 0, y: 400 },
        draggable: false,
      },
      {
        id: 'notSelectable',
        data: { label: 'notSelectable' },
        position: { x: 0, y: 500 },
        selectable: false,
      },
      {
        id: 'notDeletable',
        data: { label: 'notDeletable' },
        position: { x: 0, y: 600 },
        deletable: false,
      },
      {
        id: 'hidden',
        data: { label: 'hidden' },
        position: { x: 0, y: 700 },
        hidden: true,
      },
    ] as Node[],
    edges: [
      {
        id: '1-2',
        type: 'default',
        source: 'Node-1',
        target: 'Node-2',
        label: 'edge',
      },
      {
        id: '1-3',
        type: 'default',
        source: 'Node-1',
        target: 'Node-3',
        label: 'edge',
      },
    ] as Edge[],
  },
};

export default flowConfig;
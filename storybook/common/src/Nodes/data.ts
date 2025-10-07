import type { EdgeBase, NodeBase } from '@xyflow/system';

export interface Props {
  nodeDragThreshold?: number;
  classNames?: string;
  minZoom?: number;
  maxZoom?: number;
  panOnDrag?: boolean;
  panOnScroll?: boolean;
  zoomOnScroll?: boolean;
}

// nodes: [
//   {
//     id: 'Node-1',
//     data: { label: 'Node-1' },
//     position: { x: 0, y: 0 },
//     type: 'input',
//     class: 'playwright-test-class-123',
//     style: 'background-color: red;'
//   },
//   {
//     id: 'Node-2',
//     type: 'output',
//     data: { label: 'Node-2' },
//     position: { x: -100, y: 100 }
//   },
//   {
//     id: 'Node-3',
//     data: { label: 'Node-3' },
//     position: { x: 100, y: 100 }
//   },
//   {
//     id: 'Node-4',
//     data: { label: 'Node-4' },
//     position: { x: 0, y: 200 },
//     type: 'output'
//   },
//   {
//     id: 'drag-handle',
//     data: { label: 'Drag Handle' },
//     position: { x: 200, y: 0 },
//     type: 'DragHandleNode',
//     dragHandle: '.custom-drag-handle'
//   },
//   {
//     id: 'notConnectable',
//     type: 'output',
//     data: { label: 'notConnectable' },
//     position: { x: 0, y: 300 },
//     connectable: false
//   },
//   {
//     id: 'notDraggable',
//     data: { label: 'notDraggable' },
//     position: { x: 0, y: 400 },
//     draggable: false
//   },
//   {
//     id: 'notSelectable',
//     data: { label: 'notSelectable' },
//     position: { x: 0, y: 500 },
//     selectable: false
//   },
//   {
//     id: 'notDeletable',
//     data: { label: 'notDeletable' },
//     position: { x: 0, y: 600 },
//     deletable: false
//   },
//   {
//     id: 'hidden',
//     data: { label: 'hidden' },
//     position: { x: 0, y: 700 },
//     hidden: true
//   }
// ],
// edges: [
//   {
//     id: '1-2',
//     type: 'default',
//     source: 'Node-1',
//     target: 'Node-2',
//     label: 'edge'
//   },
//   {
//     id: '1-3',
//     type: 'default',
//     source: 'Node-1',
//     target: 'Node-3',
//     label: 'edge'
//   }
// ]

export const initialNodes: NodeBase[] = [
  {
    id: 'Node-1',
    data: { label: 'Node-1' },
    position: { x: 0, y: 0 },
    type: 'input',
    // className: 'playwright-test-class-123', // TODO
    // style: 'background-color: red;', // TODO
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
    id: 'drag-handle',
    data: { label: 'Drag Handle' },
    position: { x: 200, y: 0 },
    type: 'DragHandleNode',
    dragHandle: '.custom-drag-handle',
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
];

export const initialEdges: EdgeBase[] = [
  {
    id: '1-2',
    type: 'default',
    source: 'Node-1',
    target: 'Node-2',
    data: { label: 'edge' },
    // label: 'edge', // TODO
  },
  {
    id: '1-3',
    type: 'default',
    source: 'Node-1',
    target: 'Node-3',
    data: { label: 'edge' },
    // label: 'edge', // TODO
  },
];

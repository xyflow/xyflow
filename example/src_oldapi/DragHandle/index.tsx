import ReactFlow from 'react-flow-renderer';

import DragHandleNode from './DragHandleNode';

const nodeTypes = {
  dragHandleNode: DragHandleNode,
};

const elements = [
  {
    id: '2',
    type: 'dragHandleNode',
    dragHandle: '.custom-drag-handle',
    style: { border: '1px solid #ddd', padding: '20px 40px' },
    position: { x: 200, y: 200 },
  },
];

const DragHandleFlow = () => <ReactFlow elements={elements} nodeTypes={nodeTypes} />;

export default DragHandleFlow;

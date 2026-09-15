import { MouseEvent } from 'react';
import { ReactFlow, Node, Edge, useNodesState, useEdgesState } from '@xyflow/react';

import DragHandleNode from './DragHandleNode';

const nodeTypes = {
  dragHandleNode: DragHandleNode,
};

const initialNodes: Node[] = [
  {
    id: '2',
    type: 'dragHandleNode',
    dragHandle: '.custom-drag-handle',
    style: { border: '1px solid #ddd', padding: '20px 40px' },
    position: { x: 200, y: 200 },
    data: {},
  },
];

const onNodeClick = (_: MouseEvent, node: Node) => console.log('click', node);

const initialEdges: Edge[] = [];

const DragHandleFlow = () => {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges] = useEdgesState(initialEdges);

  return (
    <ReactFlow
      nodes={nodes}
      onNodesChange={onNodesChange}
      edges={edges}
      nodeTypes={nodeTypes}
      onNodeClick={onNodeClick}
      nodeDragThreshold={0}
    />
  );
};

export default DragHandleFlow;

import { useCallback } from 'react';
import ReactFlow, {
  Controls,
  addEdge,
  Position,
  Connection,
  useNodesState,
  useEdgesState,
  NodeChange,
} from 'reactflow';

import CustomNode from './CustomNode';

const nodeTypes = {
  custom: CustomNode,
};

const initialEdges = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
  },
];

const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: { label: 'An input node' },
    position: { x: 0, y: 0 },
    sourcePosition: Position.Right,
  },
  {
    id: '2',
    type: 'custom',
    data: { label: 'resize me!' },
    position: { x: 250, y: 0 },
    style: { padding: 10, border: '1px solid #222' },
  },
];

const CustomNodeFlow = () => {
  const [nodes, setNodes, _onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge({ ...connection }, eds)),
    [setEdges]
  );

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      _onNodesChange(changes);
    },
    [_onNodesChange]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      fitView
      minZoom={0.3}
      maxZoom={2}
    >
      <Controls />
    </ReactFlow>
  );
};

export default CustomNodeFlow;

import { useCallback } from 'react';
import ReactFlow, {
  addEdge,
  Node,
  Edge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  CoordinateExtent,
  NodeOrigin,
} from 'reactflow';

import DebugNode from './DebugNode';

const nodeExtent: CoordinateExtent = [
  [0, 0],
  [500, 500],
];

const initialNodes: Node[] = [
  {
    id: '1',
    data: { label: 'Node 1' },
    position: { x: 0, y: 0 },
  },
  {
    id: '2',
    data: { label: 'Node 2' },
    position: { x: 500, y: 0 },
  },
  {
    id: '3',
    data: { label: 'Node 3' },
    position: { x: 500, y: 500 },
  },
  {
    id: '4',
    data: { label: 'Node 4' },
    position: { x: 0, y: 500 },
  },
  {
    id: '5',
    data: { label: 'Node 5' },
    position: { x: 100, y: 50 },
    extent: nodeExtent,
  },
];

const initialEdges: Edge[] = [];

const nodeTypes = {
  default: DebugNode,
};

const NodeExtent = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((connection: Connection) => setEdges((eds) => addEdge(connection, eds)), [setEdges]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      fitView
    >
      <MiniMap />
      <Controls />
      <Background />
    </ReactFlow>
  );
};

export default NodeExtent;

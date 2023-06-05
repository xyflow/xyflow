import { useCallback } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Node,
  addEdge,
  Connection,
  Edge,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';

import Controls from './Controls';

const initialNodes: Node[] = [
  { id: '1', data: { label: 'Node 1' }, position: { x: 100, y: 100 } },
  { id: '2', data: { label: 'Node 2' }, position: { x: 100, y: 200 } },
];

const initialEdges: Edge[] = [{ id: 'e1-2', source: '1', target: '2' }];

const SaveRestore = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect = useCallback((params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  return (
    <ReactFlowProvider>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      >
        <Controls setNodes={setNodes} setEdges={setEdges} />
      </ReactFlow>
    </ReactFlowProvider>
  );
};

export default SaveRestore;

import { useState } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  Node,
  addEdge,
  Connection,
  Edge,
  ReactFlowInstance,
  useNodesState,
  useEdgesState,
} from 'react-flow-renderer';

import Controls from './Controls';

import './save.css';

const initialNodes: Node[] = [
  { id: '1', data: { label: 'Node 1' }, position: { x: 100, y: 100 } },
  { id: '2', data: { label: 'Node 2' }, position: { x: 100, y: 200 } },
];

const initialEdges: Edge[] = [{ id: 'e1-2', source: '1', target: '2' }];

const SaveRestore = () => {
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance>();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect = (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds));

  return (
    <ReactFlowProvider>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setRfInstance}
      >
        <Controls rfInstance={rfInstance} setNodes={setNodes} setEdges={setEdges} />
      </ReactFlow>
    </ReactFlowProvider>
  );
};

export default SaveRestore;

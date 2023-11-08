import { useState, useCallback } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge } from '@xyflow/react';

type FlowProps = {
  generics: GenericTestCase;
};

export default ({ generics }: FlowProps) => {
  const [nodes, setNodes] = useState(generics.flowProps.nodes);
  const [edges, setEdges] = useState(generics.flowProps.edges);

  const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
  const onEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);
  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);
  return (
    <div style={{ height: '100%' }}>
      <ReactFlow
        {...generics.flowProps}
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      ></ReactFlow>
    </div>
  );
};

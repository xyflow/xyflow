import { useState, useCallback } from 'react';
import { ReactFlow, Controls, Background, applyNodeChanges, applyEdgeChanges } from '@xyflow/react';

type FlowProps = {
  generics: GenericTestCase;
};

export default ({ generics }: FlowProps) => {
  const [nodes, setNodes] = useState(generics.reactFlowProps.nodes);
  const [edges, setEdges] = useState(generics.reactFlowProps.edges);

  const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
  const onEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);

  return (
    <div style={{ height: '100%' }}>
      <ReactFlow
        {...generics.reactFlowProps}
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

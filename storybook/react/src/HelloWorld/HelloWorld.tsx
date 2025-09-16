import { useState, useCallback } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  type Node,
  type Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const initialNodes: Node[] = [
  { id: '1', position: { x: 100, y: 100 }, data: { label: 'Hello' } },
  { id: '2', position: { x: 300, y: 100 }, data: { label: 'World!' } },
];

const initialEdges: Edge[] = [{ id: 'e1-2', source: '1', target: '2' }];

export const HelloWorld = () => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback((changes: any) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
  const onEdgesChange = useCallback((changes: any) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);
  return (
    <div style={{ width: '100%', height: '95vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        nodesDraggable
        elementsSelectable
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
      />
    </div>
  );
};

export const AnimatedHelloWorld = () => {
  const animatedEdges: Edge[] = [{ id: 'e1-2', source: '1', target: '2', animated: true }];

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow nodes={initialNodes} edges={animatedEdges} fitView>
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

export default HelloWorld;

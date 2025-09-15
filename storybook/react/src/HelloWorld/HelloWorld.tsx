import { ReactFlow, Background, Controls, type Node, type Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const initialNodes: Node[] = [
  { id: '1', position: { x: 100, y: 100 }, data: { label: 'Hello' } },
  { id: '2', position: { x: 300, y: 100 }, data: { label: 'World!' } },
];

const initialEdges: Edge[] = [{ id: 'e1-2', source: '1', target: '2' }];

export const HelloWorld = () => {
  return (
    <div style={{ width: '100%', height: '400px' }}>
      <ReactFlow nodes={initialNodes} edges={initialEdges} fitView>
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

export const AnimatedHelloWorld = () => {
  const animatedEdges: Edge[] = [{ id: 'e1-2', source: '1', target: '2', animated: true }];

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <ReactFlow nodes={initialNodes} edges={animatedEdges} fitView>
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

export default HelloWorld;

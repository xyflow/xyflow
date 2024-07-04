import { useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Background,
  BackgroundVariant,
  Controls,
  ReactFlowProvider,
  Node,
  Edge,
  useReactFlow,
  Panel,
} from '@xyflow/react';

const a = { id: 'a', data: { label: 'A' }, position: { x: 250, y: 5 } };
const b = { id: 'b', data: { label: 'B' }, position: { x: 100, y: 100 } };
const c = { id: 'c', data: { label: 'C' }, position: { x: 400, y: 100 } };

const SetNotesBatchingFlow = () => {
  const { setNodes, updateNode } = useReactFlow();

  const triggerMultipleSetNodes = useCallback(() => {
    setNodes([a]);
    setNodes((nodes) => [...nodes, b]);
    setNodes((nodes) => [...nodes, c]);
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === 'a' ? { ...node, position: { x: node.position.x + 20, y: node.position.y + 20 } } : node
      )
    );
  }, []);

  const triggerMultipleUpdateNodes = useCallback(() => {
    triggerMultipleSetNodes();
    updateNode('a', (a) => ({ position: { x: a.position.x + 20, y: a.position.y + 20 } }));
    updateNode('b', (b) => ({ position: { x: b.position.x + 20, y: b.position.y + 20 } }));
    updateNode('c', (c) => ({ position: { x: c.position.x + 20, y: c.position.y + 20 } }));
    updateNode('a', (a) => ({ data: { ...a.data, label: `A ${Date.now()}` } }));
    updateNode('b', (b) => ({ data: { ...b.data, label: `B ${Date.now()}` } }));
    updateNode('c', (c) => ({ data: { ...c.data, label: `C ${Date.now()}` } }));
  }, []);

  return (
    <ReactFlow
      defaultNodes={[]}
      defaultEdges={[]}
      className="react-flow-basic-example"
      minZoom={0.2}
      maxZoom={4}
      fitView
    >
      <Background variant={BackgroundVariant.Dots} />
      <MiniMap />
      <Controls />

      <Panel position="top-right">
        <button onClick={triggerMultipleSetNodes}>queue multiple setNodes calls</button>
        <button onClick={triggerMultipleUpdateNodes}>queue multiple updateNode calls</button>
      </Panel>
    </ReactFlow>
  );
};

export default function App() {
  return (
    <ReactFlowProvider>
      <SetNotesBatchingFlow />
    </ReactFlowProvider>
  );
}

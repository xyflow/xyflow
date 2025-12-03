import { useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Background,
  BackgroundVariant,
  Controls,
  ReactFlowProvider,
  Edge,
  useReactFlow,
  Panel,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
} from '@xyflow/react';
import { initialNodes, initialEdges } from '../CancelConnection/data';
import { RestrictExtent } from './RestrictExtent';

const a = { id: 'a', data: { label: 'A' }, position: { x: 250, y: 5 } };
const b = { id: 'b', data: { label: 'B' }, position: { x: 100, y: 100 } };
const c = { id: 'c', data: { label: 'C' }, position: { x: 400, y: 100 } };

const SetNotesBatchingFlow = () => {
  const { setNodes, updateNode } = useReactFlow();

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect = useCallback((params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const triggerMultipleSetNodes = useCallback(() => {
    setNodes([a]);
    setNodes((nodes) => [...nodes, b]);
    setNodes((nodes) => [...nodes, c]);
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === 'a' ? { ...node, position: { x: node.position.x + 2000, y: node.position.y + 20 } } : node
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
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      className="react-flow-basic-example"
      minZoom={0.2}
      maxZoom={4}
      fitView
    >
      <Panel position="top-left">
        <RestrictExtent minX={0} maxX={500} label="Restrict X" />
        <RestrictExtent minY={-100} maxY={500} label="Restrict Y" />
      </Panel>
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

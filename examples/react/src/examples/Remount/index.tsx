import { useState } from 'react';
import { ReactFlow, ReactFlowProvider, MiniMap, Background, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const defaultNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: 'Root' } },
  { id: '2', position: { x: 0, y: 120 }, data: { label: 'Child A' } },
  { id: '3', position: { x: 180, y: 120 }, data: { label: 'Child B' } },
  { id: '4', position: { x: 360, y: 120 }, data: { label: 'Child C' } },
];

const defaultEdges = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e1-3', source: '1', target: '3' },
  { id: 'e1-4', source: '1', target: '4' },
];

function Flow({ remountKey }: { remountKey: number }) {
  return (
    <ReactFlow key={remountKey} defaultNodes={defaultNodes} defaultEdges={defaultEdges} fitView>
      <Background />
      <Controls />
      <MiniMap pannable zoomable />
    </ReactFlow>
  );
}

export default function App() {
  const [remountKey, setRemountKey] = useState(0);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <button onClick={() => setRemountKey((k) => k + 1)} style={{ padding: 8 }}>
        Remount ReactFlow
      </button>
      <div style={{ flex: 1 }}>
        <ReactFlowProvider>
          <Flow remountKey={remountKey} />
        </ReactFlowProvider>
      </div>
    </div>
  );
}

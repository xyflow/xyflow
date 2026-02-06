import { useState } from 'react';
import { Node } from '@xyflow/react';
import { TopologyGraph } from './components/TopologyGraph';
import { DetailPanel } from './components/DetailPanel';
import { ResourceData } from './data/mockGraphData';
import '@xyflow/react/dist/style.css';

export default function DemoApp() {
  const [selectedNode, setSelectedNode] = useState<Node<ResourceData> | null>(null);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <TopologyGraph onNodeSelect={setSelectedNode} />
      <DetailPanel selectedNode={selectedNode} />
    </div>
  );
}

import ReactFlow from '@react-flow/core';
import '@react-flow/themes/dark';

export default function Home() {
  return (
    <div style={{ height: '100vh' }}>
      <ReactFlow defaultNodes={[]} defaultEdges={[]} />
    </div>
  );
}

import { useState } from 'react';
import { ReactFlow, Controls, type Node } from '@xyflow/react';

/*
 * Regression fixture for the fitView-on-init race. The flow mounts hidden (display: none) with
 * `fitView` and synchronously-initialized nodes, so the queued init fit fires before the container
 * is measured. Showing it must then fit correctly. Far-apart nodes and a low minZoom keep the
 * correct fit clearly distinct from the buggy clamped-to-minZoom one.
 */
const nodes: Node[] = [
  { id: 'a', position: { x: 0, y: 0 }, data: { label: 'A' }, measured: { width: 100, height: 50 } },
  { id: 'b', position: { x: 3000, y: 2000 }, data: { label: 'B' }, measured: { width: 100, height: 50 } },
];

export default function FitViewHidden() {
  const [shown, setShown] = useState(false);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <button data-testid="show" onClick={() => setShown(true)} style={{ position: 'absolute', zIndex: 10 }}>
        show
      </button>
      <div data-testid="flow-container" style={{ width: '100%', height: '100%', display: shown ? 'block' : 'none' }}>
        <ReactFlow defaultNodes={nodes} defaultEdges={[]} fitView minZoom={0.1}>
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}

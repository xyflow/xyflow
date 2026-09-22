import { Node, ReactFlow, useNodesState } from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import { useRef } from 'react';

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([
    {
      id: '0',
      position: { x: 0, y: 0 },
      data: { label: 'Rectangle Select Me First' },
    },
  ]);
  const id = useRef(0);
  return (
    <>
      <button
        onClick={() =>
          setNodes((nodes) => [
            ...nodes.map((node) => ({ ...node, selected: false })),
            {
              id: (++id.current).toString(),
              position: { x: -100, y: 100 * Math.floor((id.current + 1) / 2) },
              data: { label: `Button Node ${id.current}` },
              selected: true,
            },
            {
              id: (++id.current).toString(),
              position: { x: 100, y: (100 * id.current) / 2 },
              data: { label: `Button Node ${id.current}` },
              selected: true,
            },
          ])
        }
      >
        Click me to add nodes that are already selected.
      </button>
      <ReactFlow nodes={nodes} onNodesChange={onNodesChange} fitView></ReactFlow>
    </>
  );
}

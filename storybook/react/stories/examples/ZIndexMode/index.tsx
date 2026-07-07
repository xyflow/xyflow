import { useCallback } from 'react';
import {
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  type OnConnect,
  type Edge,
  MiniMap,
  Background,
  Controls,
  Position,
  type ZIndexMode,
} from '@xyflow/react';

const nodeDefaults = {
  sourcePosition: Position.Right,
  targetPosition: Position.Left,
};

const initialNodes = [
  { id: 'A', type: 'input', position: { x: 0, y: 150 }, data: { label: 'A' }, ...nodeDefaults },
  { id: 'B', position: { x: 250, y: 0 }, data: { label: 'B' }, ...nodeDefaults },
  { id: 'C', position: { x: 250, y: 150 }, data: { label: 'C' }, ...nodeDefaults },
  { id: 'D', position: { x: 0, y: 300 }, width: 200, height: 200, data: { label: 'D' }, ...nodeDefaults },
  { id: 'E', parentId: 'D', position: { x: 10, y: 10 }, data: { label: 'E' }, ...nodeDefaults },
  { id: 'F', position: { x: 250, y: 300 }, width: 200, height: 200, data: { label: 'F' }, ...nodeDefaults },
  { id: 'G', parentId: 'F', position: { x: 10, y: 10 }, data: { label: 'G' }, ...nodeDefaults },
  { id: 'H', position: { x: 500, y: 300 }, width: 200, height: 200, data: { label: 'H' }, ...nodeDefaults },
  { id: 'I', parentId: 'H', position: { x: 10, y: 10 }, data: { label: 'I' }, ...nodeDefaults },
];

const initialEdges: Edge[] = [
  { id: 'A-B', source: 'A', target: 'B' },
  { id: 'A-C', source: 'A', target: 'C' },
];

export type ZIndexModeExampleProps = {
  zIndexMode?: ZIndexMode;
};

export function ZIndexModeExample({ zIndexMode = 'auto' }: ZIndexModeExampleProps) {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect: OnConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      zIndexMode={zIndexMode}
      fitView
    >
      <MiniMap />
      <Background />
      <Controls />
    </ReactFlow>
  );
}

export default ZIndexModeExample;

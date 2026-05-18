import { ChangeEventHandler, useCallback, useState } from 'react';
import {
  ReactFlow,
  addEdge,
  Node,
  useNodesState,
  useEdgesState,
  OnConnect,
  Edge,
  MiniMap,
  Background,
  Controls,
  Position,
  ZIndexMode,
  Panel,
} from '@xyflow/react';

const nodeDefaults = {
  sourcePosition: Position.Right,
  targetPosition: Position.Left,
};

const initialNodes: Node[] = [
  { id: 'A', type: 'input', position: { x: 0, y: 150 }, data: { label: 'A' }, ...nodeDefaults },
  { id: 'B', position: { x: 250, y: 0 }, data: { label: 'B' }, ...nodeDefaults },
  { id: 'C', position: { x: 250, y: 150 }, data: { label: 'C' }, ...nodeDefaults },

  // group 1
  { id: 'D', position: { x: 0, y: 300 }, width: 200, height: 200, data: { label: 'D' }, ...nodeDefaults },
  { id: 'E', parentId: 'D', position: { x: 10, y: 10 }, data: { label: 'E' }, ...nodeDefaults },

  // group 2
  { id: 'F', position: { x: 250, y: 300 }, width: 200, height: 200, data: { label: 'F' }, ...nodeDefaults },
  { id: 'G', parentId: 'F', position: { x: 10, y: 10 }, data: { label: 'G' }, ...nodeDefaults },

  // group 3
  { id: 'H', position: { x: 500, y: 300 }, width: 200, height: 200, data: { label: 'H' }, ...nodeDefaults },
  { id: 'I', parentId: 'H', position: { x: 10, y: 10 }, data: { label: 'I' }, ...nodeDefaults },
];

const initialEdges: Edge[] = [
  {
    id: 'A-B',
    source: 'A',
    target: 'B',
  },
  {
    id: 'A-C',
    source: 'A',
    target: 'C',
  },
];

function ZIndexModeFlow() {
  const [zIndexMode, setZIndexMode] = useState<ZIndexMode>('auto');
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect: OnConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const onChange: ChangeEventHandler<HTMLSelectElement> = (evt) => setZIndexMode(evt.target.value as ZIndexMode);

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

      <Panel position="top-right">
        <select value={zIndexMode} onChange={onChange} data-testid="zindexmode-select">
          <option value="manual">manual</option>
          <option value="basic">basic</option>
          <option value="auto">auto</option>
        </select>
      </Panel>
    </ReactFlow>
  );
}

export default ZIndexModeFlow;

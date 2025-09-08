import { useCallback } from 'react';
import {
  ReactFlow,
  addEdge,
  useEdgesState,
  useNodesState,
  Background,
  Controls,
  type Connection,
  type Edge,
  type Node,
  Position,
} from '@xyflow/react';

import CustomNode from './CustomNode';

import '@xyflow/react/dist/style.css';

const nodeSize = {
  width: 100,
  height: 40,
};

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Node 1' },
    position: { x: 250, y: 5 },
    ...nodeSize,
    handles: [
      {
        type: 'source',
        position: Position.Bottom,
        x: nodeSize.width * 0.5,
        y: nodeSize.height,
      },
    ],
  },
  {
    id: '2',
    data: { label: 'Node 2' },
    position: { x: 100, y: 100 },
    ...nodeSize,
    handles: [
      {
        type: 'source',
        position: Position.Bottom,
        x: nodeSize.width * 0.5,
        y: nodeSize.height,
      },
      {
        type: 'target',
        position: Position.Top,
        x: nodeSize.width * 0.5,
        y: 0,
      },
    ],
  },
  {
    id: '3',
    data: { label: 'Node 3' },
    position: { x: 900, y: 100 },
    ...nodeSize,
    handles: [
      {
        type: 'source',
        position: Position.Bottom,
        x: nodeSize.width * 0.5,
        y: nodeSize.height,
      },
      {
        type: 'target',
        position: Position.Top,
        x: nodeSize.width * 0.5,
        y: 0,
      },
    ],
  },
  {
    id: '4',
    data: { label: 'Node 4' },
    position: { x: 400, y: 200 },
    width: 200,
    height: 50,
    type: 'custom',
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3', animated: true },
];

const nodeTypes = {
  custom: CustomNode,
};

function Flow() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect = useCallback((params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  return (
    <div style={{ width: 700, height: 400 }}>
      <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        // fitView
        width={700}
        height={400}
        onlyRenderVisibleElements
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default Flow;

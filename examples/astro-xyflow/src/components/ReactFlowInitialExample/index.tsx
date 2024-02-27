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
} from '@xyflow/react';

import CustomNode from './CustomNode';

import '@xyflow/react/dist/style.css';

const initialNodes: Node[] = [
  {
    id: '1',
    data: {},
    position: { x: 0, y: 0 },
    initialWidth: 200,
    initialHeight: 50,
    type: 'custom',
  },
  {
    id: '2',
    data: {},
    position: { x: 0, y: 200 },
    width: 200,
    initialHeight: 50,
    type: 'custom',
  },
];

const initialEdges: Edge[] = [{ id: 'e1-2', source: '1', target: '2' }];

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
        fitView
        width={700}
        height={400}
        debug
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default Flow;

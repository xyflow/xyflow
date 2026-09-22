import { useCallback } from 'react';
import { ReactFlow, addEdge, Node, Connection, Edge, useNodesState, useEdgesState } from '@xyflow/react';

import DevTools from './DevTools';

const initNodes: Node[] = [
  {
    id: '1a',
    type: 'input',
    data: { label: 'Node 1' },
    position: { x: 250, y: 5 },
  },
  {
    id: '2a',
    data: { label: 'Node 2' },
    position: { x: 100, y: 100 },
  },
  {
    id: '3a',
    data: { label: 'Node 3' },
    position: { x: 400, y: 100 },
  },
  {
    id: '4a',
    data: { label: 'Node 4' },
    position: { x: 400, y: 200 },
  },
];

const initEdges: Edge[] = [
  { id: 'e1-2', source: '1a', target: '2a' },
  { id: 'e1-3', source: '1a', target: '3a' },
];

const BasicFlow = () => {
  const [nodes, , onNodesChange] = useNodesState(initNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initEdges);

  const onConnect = useCallback((params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      fitView
    >
      <DevTools />
    </ReactFlow>
  );
};

export default BasicFlow;

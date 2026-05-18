import { useCallback } from 'react';
import {
  ReactFlow,
  Node,
  addEdge,
  Connection,
  Edge,
  useNodesState,
  useEdgesState,
  Background,
  BackgroundVariant,
} from '@xyflow/react';

import ConnectionLine from './ConnectionLine';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'default',
    data: { label: 'Node 1' },
    position: { x: 250, y: 5 },
  },
];
const initialEdges: Edge[] = [];

const ConnectionLineFlow = () => {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect = useCallback((params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      connectionLineComponent={ConnectionLine}
      onConnect={onConnect}
      connectionDragThreshold={25}
    >
      <Background variant={BackgroundVariant.Lines} />
    </ReactFlow>
  );
};

export default ConnectionLineFlow;

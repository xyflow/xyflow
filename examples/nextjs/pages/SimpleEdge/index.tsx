import React, { useCallback } from 'react';
import ReactFlow, { addEdge, Connection, Node, Edge, useNodesState, useEdgesState, Position } from 'reactflow';

const sourcePosition = Position.Bottom;
const targetPosition = Position.Bottom;

const initialNodes: Node[] = [
  { id: '1', position: { x: 0, y: 0 }, data: {}, sourcePosition, targetPosition },
  { id: '2', position: { x: 250, y: -100 }, data: {}, sourcePosition, targetPosition },
];

const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    type: 'smoothstep',
    animated: true,
  },
];

const SimpleEdge = () => {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection | Edge) => {
      console.log('on connect', params);
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      fitView
    />
  );
};

export default SimpleEdge;

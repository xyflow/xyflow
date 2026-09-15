import { defaultFlowProps } from '@shared/defaultFlow';
import { useState, useCallback, MouseEvent as ReactMouseEvent } from 'react';
import {
  ReactFlow,
  Controls,
  reconnectEdge,
  addEdge,
  Connection,
  Edge,
  Node,
  NodeChangeset,
  EdgeChangeset,
  HandleType,
} from '@xyflow/react';

const initialNodes = defaultFlowProps.nodes;
const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', label: 'Reconnect source', reconnectable: 'source' },
  { id: 'e2-3', source: '2', target: '3', label: 'Reconnect target', reconnectable: 'target' },
  { id: 'e3-4', source: '3', target: '4', label: 'Reconnect either end', reconnectable: true },
];

const onReconnectStart = (_: ReactMouseEvent, edge: Edge, handleType: HandleType) =>
  console.log(`start update ${handleType} handle`, edge);
const onReconnectEnd = (_: MouseEvent | TouchEvent, edge: Edge, handleType: HandleType) =>
  console.log(`end update ${handleType} handle`, edge);

const ReconnectEdge = () => {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const onReconnect = (oldEdge: Edge, newConnection: Connection) =>
    setEdges((els) => reconnectEdge(oldEdge, newConnection, els));
  const onConnect = (connection: Connection) => setEdges((els) => addEdge(connection, els));

  const onNodesChange = useCallback((changes: NodeChangeset) => {
    setNodes((ns) => changes.applyTo(ns));
  }, []);

  const onEdgesChange = useCallback((changes: EdgeChangeset) => {
    setEdges((es) => changes.applyTo(es));
  }, []);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      snapToGrid={true}
      onReconnect={onReconnect}
      onConnect={onConnect}
      onReconnectStart={onReconnectStart}
      onReconnectEnd={onReconnectEnd}
      fitView
    >
      <Controls />
    </ReactFlow>
  );
};

export default ReconnectEdge;

import { useState, useCallback, MouseEvent as ReactMouseEvent } from 'react';
import {
  ReactFlow,
  Controls,
  reconnectEdge,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Connection,
  Edge,
  Node,
  NodeChange,
  EdgeChange,
  HandleType,
} from '@xyflow/react';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: {
      label: (
        <>
          Node <strong>A</strong>
        </>
      ),
    },
    position: { x: 250, y: 0 },
  },
  {
    id: '2',
    data: {
      label: (
        <>
          Node <strong>B</strong>
        </>
      ),
    },
    position: { x: 75, y: 0 },
  },
  {
    id: '3',
    data: {
      label: (
        <>
          Node <strong>C</strong>
        </>
      ),
    },
    position: { x: 400, y: 100 },
    style: {
      background: '#D6D5E6',
      color: '#333',
      border: '1px solid #222138',
      width: 180,
    },
  },
  {
    id: '4',
    data: {
      label: (
        <>
          Node <strong>D</strong>
        </>
      ),
    },
    position: { x: -75, y: 100 },
  },
  {
    id: '5',
    data: {
      label: (
        <>
          Node <strong>E</strong>
        </>
      ),
    },
    position: { x: 150, y: 100 },
  },
  {
    id: '6',
    data: {
      label: (
        <>
          Node <strong>F</strong>
        </>
      ),
    },
    position: { x: 150, y: 250 },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-3', source: '1', target: '3', label: 'This edge can only be updated from source', reconnectable: 'source' },
  { id: 'e2-4', source: '2', target: '4', label: 'This edge can only be updated from target', reconnectable: 'target' },
  { id: 'e5-6', source: '5', target: '6', label: 'This edge can be updated from both sides' },
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

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((ns) => applyNodeChanges(changes, ns));
  }, []);

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges((es) => applyEdgeChanges(changes, es));
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

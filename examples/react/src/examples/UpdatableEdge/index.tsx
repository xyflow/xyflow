import { useState, useCallback, MouseEvent as ReactMouseEvent } from 'react';
import {
  ReactFlow,
  Controls,
  updateEdge,
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
  { id: 'e1-3', source: '1', target: '3', label: 'This edge can only be updated from source', updatable: 'source' },
  { id: 'e2-4', source: '2', target: '4', label: 'This edge can only be updated from target', updatable: 'target' },
  { id: 'e5-6', source: '5', target: '6', label: 'This edge can be updated from both sides' },
];

const onEdgeUpdateStart = (_: ReactMouseEvent, edge: Edge, handleType: HandleType) =>
  console.log(`start update ${handleType} handle`, edge);
const onEdgeUpdateEnd = (_: MouseEvent | TouchEvent, edge: Edge, handleType: HandleType) =>
  console.log(`end update ${handleType} handle`, edge);

const UpdatableEdge = () => {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const onEdgeUpdate = (oldEdge: Edge, newConnection: Connection) =>
    setEdges((els) => updateEdge(oldEdge, newConnection, els));
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
      onEdgeUpdate={onEdgeUpdate}
      onConnect={onConnect}
      onEdgeUpdateStart={onEdgeUpdateStart}
      onEdgeUpdateEnd={onEdgeUpdateEnd}
      fitView
    >
      <Controls />
    </ReactFlow>
  );
};

export default UpdatableEdge;

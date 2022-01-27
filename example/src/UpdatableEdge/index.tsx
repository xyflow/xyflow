import React, { useState, useCallback } from 'react';
import ReactFlow, {
  Controls,
  updateEdge,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  ReactFlowInstance,
  Connection,
  Edge,
  Node,
  NodeChange,
  EdgeChange,
} from 'react-flow-renderer';

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
    position: { x: 100, y: 100 },
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
    style: { background: '#D6D5E6', color: '#333', border: '1px solid #222138', width: 180 },
  },
];

const initialEdges = [{ id: 'e1-2', source: '1', target: '2', label: 'This is a draggable edge' }];

const onInit = (reactFlowInstance: ReactFlowInstance) => reactFlowInstance.fitView();
const onEdgeUpdateStart = (_: React.MouseEvent, edge: Edge) => console.log('start update', edge);
const onEdgeUpdateEnd = (_: MouseEvent, edge: Edge) => console.log('end update', edge);

const UpdatableEdge = () => {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const onEdgeUpdate = (oldEdge: Edge, newConnection: Connection) =>
    setEdges((els) => updateEdge(oldEdge, newConnection, els));
  const onConnect = (connection: Connection) => setEdges((els) => addEdge(connection, els));

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    console.log(changes);
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
      onInit={onInit}
      snapToGrid={true}
      onEdgeUpdate={onEdgeUpdate}
      onConnect={onConnect}
      onEdgeUpdateStart={onEdgeUpdateStart}
      onEdgeUpdateEnd={onEdgeUpdateEnd}
    >
      <Controls />
    </ReactFlow>
  );
};

export default UpdatableEdge;

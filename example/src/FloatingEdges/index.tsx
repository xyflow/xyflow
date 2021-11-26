import { useState, useCallback } from 'react';

import ReactFlow, {
  addEdge,
  Background,
  OnLoadParams,
  EdgeTypesType,
  Node,
  Connection,
  Edge,
  applyNodeChanges,
  applyEdgeChanges,
  NodeChange,
  EdgeChange,
} from 'react-flow-renderer';

import './style.css';

import FloatingEdge from './FloatingEdge';
import FloatingConnectionLine from './FloatingConnectionLine';
import { createElements } from './utils';

const onLoad = (reactFlowInstance: OnLoadParams) => reactFlowInstance.fitView();

const { nodes: initialNodes, edges: initialEdges } = createElements();

const edgeTypes: EdgeTypesType = {
  floating: FloatingEdge,
};

const FloatingEdges = () => {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const onConnect = useCallback((connection: Connection) => {
    setEdges((eds) => addEdge(connection, eds));
  }, []);

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((ns) => applyNodeChanges(changes, ns));
  }, []);

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges((es) => applyEdgeChanges(changes, es));
  }, []);

  return (
    <div className="floatingedges">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onLoad={onLoad}
        edgeTypes={edgeTypes}
        connectionLineComponent={FloatingConnectionLine}
      >
        <Background />
      </ReactFlow>
    </div>
  );
};

export default FloatingEdges;

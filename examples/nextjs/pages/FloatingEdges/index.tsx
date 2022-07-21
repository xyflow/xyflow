import React, { useCallback } from 'react';

import ReactFlow, {
  addEdge,
  ReactFlowInstance,
  EdgeTypes,
  Connection,
  useNodesState,
  useEdgesState,
} from '@react-flow/core';

import Background from '@react-flow/background';

import styles from './style.module.css';

import FloatingConnectionLine from './FloatingConnectionLine';
import FloatingEdge from './FloatingEdge';
import { createElements } from './utils';

const onInit = (reactFlowInstance: ReactFlowInstance) =>
  reactFlowInstance.fitView();

const { nodes: initialNodes, edges: initialEdges } =
  typeof window !== 'undefined' ? createElements() : { nodes: [], edges: [] };
const edgeTypes: EdgeTypes = {
  floating: FloatingEdge,
};

const FloatingEdges = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((connection: Connection) => {
    setEdges((eds) => addEdge(connection, eds));
  }, []);

  return (
    <div className={styles.floatingedges}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={onInit}
        edgeTypes={edgeTypes}
        connectionLineComponent={FloatingConnectionLine}
      >
        <Background />
      </ReactFlow>
    </div>
  );
};

export default FloatingEdges;

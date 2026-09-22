import type { FlowConfig } from './types';
import { useState, useCallback } from 'react';
import { ReactFlow, addEdge, reconnectEdge, OnNodesChange, OnEdgesChange, OnConnect, OnReconnect } from '@xyflow/react';

type FlowProps = {
  flowConfig: FlowConfig;
};

export default ({ flowConfig }: FlowProps) => {
  const [nodes, setNodes] = useState(flowConfig.flowProps.nodes);
  const [edges, setEdges] = useState(flowConfig.flowProps.edges);
  const props = { ...flowConfig.flowProps, nodes, edges };

  const onNodesChange: OnNodesChange = useCallback((changes) => setNodes((nds) => changes.applyTo(nds)), []);
  const onEdgesChange: OnEdgesChange = useCallback((changes) => setEdges((eds) => changes.applyTo(eds)), []);
  const onConnect: OnConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);
  const onReconnect: OnReconnect = useCallback(
    (oldEdge, connection) => setEdges((eds) => reconnectEdge(oldEdge, connection, eds)),
    []
  );

  return (
    <div style={{ height: '100%' }}>
      <ReactFlow
        {...props}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onReconnect={onReconnect}
      />
    </div>
  );
};

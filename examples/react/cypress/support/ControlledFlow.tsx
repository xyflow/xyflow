import { useCallback, useState } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  Connection,
  addEdge,
  ReactFlowProps,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
} from '@xyflow/react';

function ControlledFlow({
  addOnNodeChangeHandler = true,
  addOnEdgeChangeHandler = true,
  addOnConnectHandler = true,
  initialNodes = [],
  initialEdges = [],
  ...rest
}: {
  initialNodes?: Node[];
  initialEdges?: Edge[];
  addOnNodeChangeHandler?: boolean;
  addOnEdgeChangeHandler?: boolean;
  addOnConnectHandler?: boolean;
} & Partial<ReactFlowProps>) {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const onNodesChange: OnNodesChange = useCallback((changes) => setNodes((nds) => changes.applyTo(nds)), [setNodes]);

  const onEdgesChange: OnEdgesChange = useCallback((changes) => setEdges((eds) => changes.applyTo(eds)), [setEdges]);

  const onConnect = useCallback((params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const handlers: {
    onNodesChange?: OnNodesChange;
    onEdgesChange?: OnEdgesChange;
    onConnect?: OnConnect;
  } = {};

  if (addOnNodeChangeHandler) {
    handlers.onNodesChange = onNodesChange;
  }

  if (addOnEdgeChangeHandler) {
    handlers.onEdgesChange = onEdgesChange;
  }

  if (addOnConnectHandler) {
    handlers.onConnect = onConnect;
  }

  return <ReactFlow nodes={nodes} edges={edges} {...handlers} {...rest} nodeDragThreshold={0} />;
}

export default ControlledFlow;

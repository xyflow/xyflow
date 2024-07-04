import { useCallback, useState } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
  Connection,
  addEdge,
  ReactFlowProps,
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

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const onConnect = useCallback((params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const handlers: {
    onNodesChange?: (changes: NodeChange[]) => void;
    onEdgesChange?: (changes: EdgeChange[]) => void;
    onConnect?: (params: Connection | Edge) => void;
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

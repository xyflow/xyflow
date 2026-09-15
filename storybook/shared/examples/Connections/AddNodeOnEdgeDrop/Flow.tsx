import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  useReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  type Node,
  type Edge,
  type OnConnectEnd,
} from '@xyflow/react';
import { defaultFlowProps } from '../../../defaultFlow';
import { dropPosition } from './config';
function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(structuredClone(defaultFlowProps.nodes));
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(structuredClone(defaultFlowProps.edges));
  const { screenToFlowPosition } = useReactFlow();
  const onConnectEnd: OnConnectEnd = (event, connection) => {
    if (
      connection.isValid ||
      !connection.fromNode ||
      !(event.target instanceof Element) ||
      !event.target.classList.contains('react-flow__pane')
    )
      return;
    const pointer = dropPosition(event);
    if (!pointer) return;
    const id = crypto.randomUUID();
    setNodes((nodes) => [
      ...nodes,
      { id, position: screenToFlowPosition(pointer), origin: [0.5, 0], data: { label: 'New node' } },
    ]);
    const from = connection.fromNode.id;
    const handle = connection.fromHandle;
    setEdges((edges) => [
      ...edges,
      {
        id: `edge-${id}`,
        ...(handle?.type === 'target'
          ? { source: id, target: from, targetHandle: handle.id }
          : { source: from, sourceHandle: handle?.id, target: id }),
      },
    ]);
  };
  return (
    <ReactFlow
      {...defaultFlowProps}
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={(connection) => setEdges((edges) => addEdge(connection, edges))}
      onConnectEnd={onConnectEnd}
    >
      <Background />
    </ReactFlow>
  );
}
export default function Example() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}

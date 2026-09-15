import { ReactFlow, Background, useNodesState, useEdgesState, addEdge, type Node, type Edge } from '@xyflow/react';
import { defaultFlowProps } from '../../../defaultFlow';
import ConnectionLine from './ConnectionLine';
export default function Flow() {
  const [nodes, , onNodesChange] = useNodesState<Node>(structuredClone(defaultFlowProps.nodes));
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(structuredClone(defaultFlowProps.edges));
  return (
    <ReactFlow
      {...defaultFlowProps}
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={(connection) => setEdges((edges) => addEdge(connection, edges))}
      connectionLineComponent={ConnectionLine}
      connectionDragThreshold={25}
    >
      <Background />
    </ReactFlow>
  );
}

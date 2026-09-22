import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  type Node,
  type Edge,
} from '@xyflow/react';
import { defaultFlowProps } from '../../../defaultFlow';
import { initialNodes, initialEdges } from './config';
import ColorNode from './ColorNode';
const nodeTypes = { color: ColorNode };
export default function Flow() {
  const [nodes, , onNodesChange] = useNodesState<Node>(structuredClone(initialNodes));
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(structuredClone(initialEdges));
  return (
    <ReactFlow
      {...defaultFlowProps}
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={(connection) => setEdges((edges) => addEdge(connection, edges))}
    >
      <Background bgColor={String(nodes.find((node) => node.id === '2')?.data.color ?? '#fff')} />
      <Controls />
    </ReactFlow>
  );
}

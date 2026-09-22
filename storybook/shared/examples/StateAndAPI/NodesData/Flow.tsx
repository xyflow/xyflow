import { useCallback } from 'react';
import {
  ReactFlow,
  Controls,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Background,
  Node,
  Edge,
} from '@xyflow/react';

import TextNode from './TextNode';
import ResultNode from './ResultNode';
import UppercaseNode from './UppercaseNode';

export type TextNode = Node<{ text: string }, 'text'>;
export type ResultNode = Node<{}, 'result'>;
export type UppercaseNode = Node<{ text: string }, 'uppercase'>;
export type MyNode = TextNode | ResultNode | UppercaseNode;

export function isTextNode(node: any): node is TextNode | UppercaseNode {
  return !node || !node.type ? false : node.type === 'text' || node.type === 'uppercase';
}

const nodeTypes = {
  text: TextNode,
  result: ResultNode,
  uppercase: UppercaseNode,
};

import { initialNodes, initialEdges } from './config';
const CustomNodeFlow = () => {
  const [nodes, , onNodesChange] = useNodesState<MyNode>(structuredClone(initialNodes) as MyNode[]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(structuredClone(initialEdges) as Edge[]);

  const onConnect = useCallback((connection: Connection) => setEdges((eds) => addEdge(connection, eds)), [setEdges]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      fitView
    >
      <Controls />
      <Background />
    </ReactFlow>
  );
};

export default CustomNodeFlow;

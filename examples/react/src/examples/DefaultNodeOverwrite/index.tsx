import { ReactFlow, Node, ReactFlowProvider, Background, BackgroundVariant, NodeProps } from '@xyflow/react';

const initialNodes: Node[] = [
  {
    id: '1',
    data: { label: 'Node 1' },
    position: { x: 250, y: 5 },
    className: 'light',
  },
  {
    id: '2',
    data: { label: 'Node 2' },
    type: 'unregistered',
    position: { x: 100, y: 100 },
    className: 'light',
  },
];

const CustomNode = (_: NodeProps) => {
  return <div>Custom node</div>;
};

const nodeTypes = {
  default: CustomNode,
};

const DefaultNodeOverwrite = () => {
  return (
    <ReactFlow defaultNodes={initialNodes} nodeTypes={nodeTypes} fitView>
      <Background variant={BackgroundVariant.Lines} />
    </ReactFlow>
  );
};

export default function App() {
  return (
    <ReactFlowProvider>
      <DefaultNodeOverwrite />
    </ReactFlowProvider>
  );
}

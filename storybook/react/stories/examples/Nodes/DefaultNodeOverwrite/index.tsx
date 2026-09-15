import { defaultFlowProps } from '@shared/defaultFlow';
import { ReactFlow, Node, ReactFlowProvider, Background, BackgroundVariant, NodeProps } from '@xyflow/react';

const initialNodes: Node[] = defaultFlowProps.nodes
  .slice(0, 2)
  .map((node, index) => ({ ...node, type: index === 0 ? undefined : 'unregistered' }));

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

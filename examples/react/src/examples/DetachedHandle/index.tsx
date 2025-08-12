import {
  ReactFlow,
  Node,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  NodeProps,
  Handle,
  Position,
} from '@xyflow/react';

import './style.css';

const initialNodes: Node[] = [
  {
    id: '1',
    data: { label: 'Node 1' },
    position: { x: 250, y: 5 },
  },
  {
    id: '2',
    data: { label: 'Node 2' },
    position: { x: 50, y: 100 },
  },
  {
    id: '3',
    data: { label: 'Node 3' },
    position: { x: 450, y: 100 },
  },
];

const CustomNode = (_: NodeProps) => {
  return (
    <>
      <Handle type="target" position={Position.Left} />
      <div>Custom node</div>
      <Handle type="source" position={Position.Right}>
        <button className="detached-handle">➡️</button>
      </Handle>
    </>
  );
};

const nodeTypes = {
  default: CustomNode,
};

const DetachedHandle = () => {
  return (
    <ReactFlow defaultNodes={initialNodes} defaultEdges={[]} connectionRadius={10} nodeTypes={nodeTypes} fitView>
      <Background variant={BackgroundVariant.Lines} />
    </ReactFlow>
  );
};

export default function App() {
  return (
    <ReactFlowProvider>
      <DetachedHandle />
    </ReactFlowProvider>
  );
}

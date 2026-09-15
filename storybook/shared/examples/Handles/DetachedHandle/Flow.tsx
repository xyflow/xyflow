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

import { initialNodes } from './config';
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
  detached: CustomNode,
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

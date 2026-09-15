import {
  Background,
  BackgroundVariant,
  Controls,
  Edge,
  EdgeTypes,
  MiniMap,
  Node,
  Position,
  ReactFlow,
} from '@xyflow/react';

import { CustomEdge } from './CustomEdge';

const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
};

import { initialNodes, initialEdges } from './config';
export default function EdgeToolbarExample() {
  return (
    <ReactFlow
      defaultNodes={initialNodes as Node[]}
      defaultEdges={initialEdges as Edge[]}
      className="react-flow-edge-toolbar-example"
      minZoom={0.2}
      maxZoom={4}
      fitView
      edgeTypes={edgeTypes}
    >
      <Background variant={BackgroundVariant.Dots} />
      <MiniMap />
      <Controls />
    </ReactFlow>
  );
}

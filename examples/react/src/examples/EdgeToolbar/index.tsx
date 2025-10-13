import {
  ReactFlow,
  MiniMap,
  Background,
  BackgroundVariant,
  Controls,
  Node,
  Edge,
  NodeTypes,
  Position,
  NodeOrigin,
  EdgeTypes,
} from '@xyflow/react';

import { CustomEdge } from './CustomEdge';

const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
};

const initialNodes: Node[] = [
  {
    id: '1',
    data: { label: 'Node 1', toolbarPosition: Position.Top },
    position: { x: 0, y: 0 },
    className: 'react-flow__node-default',
  },
  {
    id: '2',
    data: { label: 'Node 2', toolbarPosition: Position.Top },
    position: { x: 200, y: 0 },
    className: 'react-flow__node-default',
  },
  {
    id: '3',
    data: { label: 'Node 3', toolbarPosition: Position.Top },
    position: { x: 100, y: 150 },
    className: 'react-flow__node-default',
  },
];

const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    type: 'custom',
  },
  {
    id: 'e2-3',
    source: '2',
    target: '3',
    type: 'custom',
  },
  {
    id: 'e3-1',
    source: '3',
    target: '1',
    type: 'custom',
  },
];

const defaultEdgeOptions = { zIndex: 0 };
const nodeOrigin: NodeOrigin = [0.5, 0.5];

export default function EdgeToolbarExample() {
  return (
    <ReactFlow
      defaultNodes={initialNodes}
      defaultEdges={initialEdges}
      className="react-flow-edge-toolbar-example"
      minZoom={0.2}
      maxZoom={4}
      fitView
      defaultEdgeOptions={defaultEdgeOptions}
      edgeTypes={edgeTypes}
      nodeOrigin={nodeOrigin}
    >
      <Background variant={BackgroundVariant.Dots} />
      <MiniMap />
      <Controls />
    </ReactFlow>
  );
}

import ReactFlow, {
  MiniMap,
  Background,
  BackgroundVariant,
  Controls,
  Node,
  Edge,
  NodeTypes,
  Position,
} from 'reactflow';

import CustomNode from './CustomNode';

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'custom',
    data: { label: 'toolbar top', toolbarPosition: Position.Top },
    position: { x: 0, y: 0 },
    className: 'react-flow__node-default',
  },
  {
    id: '2',
    type: 'custom',
    data: { label: 'toolbar right', toolbarPosition: Position.Right },
    position: { x: 400, y: 0 },
    className: 'react-flow__node-default',
  },
  {
    id: '3',
    type: 'custom',
    data: { label: 'toolbar bottom', toolbarPosition: Position.Bottom },
    position: { x: 400, y: 100 },
    className: 'react-flow__node-default',
  },
  {
    id: '4',
    type: 'custom',
    data: { label: 'toolbar left', toolbarPosition: Position.Left },
    position: { x: 400, y: 200 },
    className: 'react-flow__node-default',
  },
  {
    id: '5',
    type: 'custom',
    data: { label: 'toolbar always open', toolbarPosition: Position.Top, toolbarVisible: true },
    position: { x: 0, y: 150 },
    className: 'react-flow__node-default',
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e1-3', source: '1', target: '3' },
  { id: 'e1-4', source: '1', target: '4' },
];

const defaultEdgeOptions = { zIndex: 0 };

export default function NodeToolbarExample() {
  return (
    <ReactFlow
      defaultNodes={initialNodes}
      defaultEdges={initialEdges}
      className="react-flow-node-toolbar-example"
      minZoom={0.2}
      maxZoom={4}
      fitView
      defaultEdgeOptions={defaultEdgeOptions}
      nodeTypes={nodeTypes}
    >
      <Background variant={BackgroundVariant.Dots} />
      <MiniMap />
      <Controls />
    </ReactFlow>
  );
}

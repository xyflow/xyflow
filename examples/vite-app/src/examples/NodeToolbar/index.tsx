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
} from '@xyflow/react';

import CustomNode from './CustomNode';
import SelectedNodesToolbar from './SelectedNodesToolbar';

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

const positions = ['top', 'right', 'bottom', 'left'];
const alignments = ['start', 'center', 'end'];

const initialNodes: Node[] = [
  {
    id: '4',
    type: 'custom',
    data: { label: 'toolbar top', toolbarPosition: Position.Top },
    position: { x: 0, y: -200 },
    className: 'react-flow__node-default',
  },
];

positions.forEach((position, posIndex) => {
  alignments.forEach((align, alignIndex) => {
    const id = `node-${align}-${position}`;
    initialNodes.push({
      id,
      type: 'custom',
      data: {
        label: `toolbar ${position} ${align}`,
        toolbarPosition: position as Position,
        toolbarAlign: align,
        toolbarVisible: true,
      },
      className: 'react-flow__node-default',
      position: { x: posIndex * 300, y: alignIndex * 100 },
    });
  });
});

const initialEdges: Edge[] = [];

const defaultEdgeOptions = { zIndex: 0 };
const nodeOrigin: NodeOrigin = [0.5, 0.5];

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
      nodeOrigin={nodeOrigin}
    >
      <Background variant={BackgroundVariant.Dots} />
      <MiniMap />
      <Controls />
      <SelectedNodesToolbar />
    </ReactFlow>
  );
}

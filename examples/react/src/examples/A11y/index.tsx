import { MouseEvent } from 'react';
import {
  ReactFlow,
  MiniMap,
  Background,
  BackgroundVariant,
  Controls,
  ReactFlowProvider,
  Node,
  Edge,
  OnNodeDrag,
  AriaLabelConfig,
} from '@xyflow/react';

const onNodeDrag: OnNodeDrag = (_, node: Node, nodes: Node[]) => console.log('drag', node, nodes);
const onNodeDragStart = (_: MouseEvent, node: Node, nodes: Node[]) => console.log('drag start', node, nodes);
const onNodeDragStop = (_: MouseEvent, node: Node, nodes: Node[]) => console.log('drag stop', node, nodes);
const onNodeClick = (_: MouseEvent, node: Node) => console.log('click', node);

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'A11y Node 1' },
    position: { x: 250, y: 5 },
  },
  {
    id: '2',
    data: { label: 'Node 2' },
    position: { x: 1000, y: 100 },
  },
  {
    id: '3',
    data: { label: 'Node 3' },
    position: { x: 100, y: 100 },
    className: 'light',
    ariaRoleDescription: 'custom node role',
    ariaRole: 'button',
  },
  {
    id: '4',
    data: { label: 'Node 4' },
    position: { x: 300, y: 100 },
    className: 'light',
    ariaRoleDescription: 'custom node role',
    ariaRole: 'button',
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3' },
  { id: 'e1-4', source: '1', target: '4' },
];

const ariaLabelConfig: Partial<AriaLabelConfig> = {
  'node.a11yDescription.default': 'Custom Node Desc.',
  'node.a11yDescription.keyboardDisabled': 'Custom Keyboard Desc.',
  'node.a11yDescription.ariaLiveMessage': ({ direction, x, y }) =>
    `Custom Moved selected node ${direction}. New position, x: ${x}, y: ${y}`,
  'edge.a11yDescription.default': 'Custom Edge Desc.',
  'controls.ariaLabel': 'Custom Controls Aria Label',
  'controls.zoomIn.ariaLabel': 'Custom Zoom in',
  'controls.zoomOut.ariaLabel': 'Custom Zoom Out',
  'controls.fitView.ariaLabel': 'Custom Fit View',
  'controls.interactive.ariaLabel': 'Custom Toggle Interactivity',
  'minimap.ariaLabel': 'Custom Aria Label',
};

const A11y = () => {
  return (
    <ReactFlow
      defaultNodes={initialNodes}
      defaultEdges={initialEdges}
      onNodesChange={console.log}
      onNodeClick={onNodeClick}
      onNodeDragStop={onNodeDragStop}
      onNodeDragStart={onNodeDragStart}
      onNodeDrag={onNodeDrag}
      className="react-flow-basic-example"
      minZoom={2}
      maxZoom={4}
      // fitView
      selectNodesOnDrag={false}
      elevateEdgesOnSelect
      elevateNodesOnSelect={false}
      nodeDragThreshold={0}
      ariaLabelConfig={ariaLabelConfig}
    >
      <Background variant={BackgroundVariant.Dots} />
      <MiniMap />
      <Controls />
    </ReactFlow>
  );
};

export default function App() {
  return (
    <ReactFlowProvider>
      <A11y />
    </ReactFlowProvider>
  );
}

import { MouseEvent, useMemo, useEffect } from 'react';
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
  FitViewOptions,
  useStore,
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
    className: 'light',
  },
  {
    id: '2',
    data: { label: 'Node 2' },
    position: { x: 100, y: 100 },
    className: 'light',
  },
  {
    id: '3',
    data: { label: 'Node 3' },
    position: { x: 400, y: 100 },
    className: 'light',
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3' },
];

const A11y = () => {
  const labelConfig = useStore((state) => state.labelConfig);
  const updateLabelConfig = useStore((state) => state.updateLabelConfig);

  useEffect(() => {
    console.log('Label Config:', labelConfig);
  }, [labelConfig]);

  useEffect(() => {
    console.log('Updating labelConfig...');
    updateLabelConfig({
      'a11yDescription.node.default': 'Updated Node Desc.',
      'a11yDescription.node.keyboardDisabled': 'Updated Keyboard Desc.',
      'a11yDescription.edge.default': 'Updated Edge Desc.',
    });
  }, [updateLabelConfig]);

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
      minZoom={0.2}
      maxZoom={4}
      fitView
      selectNodesOnDrag={false}
      elevateEdgesOnSelect
      elevateNodesOnSelect={false}
      nodeDragThreshold={0}
      labelConfig={{
        'a11yDescription.node.default': 'Custom Node Desc.',
        'a11yDescription.node.keyboardDisabled': 'Custom Keyboard Desc.',
        'a11yDescription.edge.default': 'Custom Edge Desc.',
      }}
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

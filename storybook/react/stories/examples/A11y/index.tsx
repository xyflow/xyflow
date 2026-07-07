import {
  ReactFlow,
  MiniMap,
  Background,
  BackgroundVariant,
  Controls,
  ReactFlowProvider,
  Node,
  Edge,
  AriaLabelConfig,
} from '@xyflow/react';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'A11y Node 1' },
    position: { x: 250, y: 5 },
    className: 'light',
    domAttributes: {
      tabIndex: 10,
      'aria-roledescription': 'A11y Node',
    },
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
    ariaRole: 'button',
  },
  {
    id: '4',
    data: { label: 'Node 4' },
    position: { x: 300, y: 100 },
  },
  {
    id: '5',
    data: { label: 'Node 5' },
    position: { x: 400, y: 200 },
  },
  {
    id: '6',
    data: { label: 'Node 6' },
    position: { x: -1000, y: 200 },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3' },
  { id: 'e1-4', source: '1', target: '4' },
  { id: 'e1-5', source: '4', target: '5' },
  { id: 'e1-6', source: '3', target: '6' },
];

export type A11yExampleProps = {
  autoPanOnNodeFocus?: boolean;
  ariaNodeDefault?: string;
  ariaNodeKeyboardDisabled?: string;
  ariaNodeLiveMessagePrefix?: string;
  ariaEdgeDefault?: string;
  ariaControlsLabel?: string;
  ariaControlsZoomIn?: string;
  ariaControlsZoomOut?: string;
  ariaControlsFitView?: string;
  ariaControlsInteractive?: string;
  ariaMinimap?: string;
};

export function A11yExample({
  autoPanOnNodeFocus = true,
  ariaNodeDefault = 'Custom Node Desc.',
  ariaNodeKeyboardDisabled = 'Custom Keyboard Desc.',
  ariaNodeLiveMessagePrefix = 'Custom Moved selected node',
  ariaEdgeDefault = 'Custom Edge Desc.',
  ariaControlsLabel = 'Custom Controls Aria Label',
  ariaControlsZoomIn = 'Custom Zoom in',
  ariaControlsZoomOut = 'Custom Zoom Out',
  ariaControlsFitView = 'Custom Fit View',
  ariaControlsInteractive = 'Custom Toggle Interactivity',
  ariaMinimap = 'Custom Aria Label',
}: A11yExampleProps) {
  const ariaLabelConfig: Partial<AriaLabelConfig> = {
    'node.a11yDescription.default': ariaNodeDefault,
    'node.a11yDescription.keyboardDisabled': ariaNodeKeyboardDisabled,
    'node.a11yDescription.ariaLiveMessage': ({ direction, x, y }) =>
      `${ariaNodeLiveMessagePrefix} ${direction}. New position, x: ${x}, y: ${y}`,
    'edge.a11yDescription.default': ariaEdgeDefault,
    'controls.ariaLabel': ariaControlsLabel,
    'controls.zoomIn.ariaLabel': ariaControlsZoomIn,
    'controls.zoomOut.ariaLabel': ariaControlsZoomOut,
    'controls.fitView.ariaLabel': ariaControlsFitView,
    'controls.interactive.ariaLabel': ariaControlsInteractive,
    'minimap.ariaLabel': ariaMinimap,
  };

  return (
    <ReactFlow
      defaultNodes={initialNodes}
      defaultEdges={initialEdges}
      autoPanOnNodeFocus={autoPanOnNodeFocus}
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
}

export default function App() {
  return (
    <ReactFlowProvider>
      <A11yExample />
    </ReactFlowProvider>
  );
}

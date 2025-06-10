import { useState } from 'react';
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
  Panel,
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
  const [autoPanOnNodeFocus, setAutoPanOnNodeFocus] = useState(true);

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
      <Panel position="top-right">
        <div>
          <label htmlFor="focusPannable">
            <input
              id="focusPannable"
              type="checkbox"
              checked={autoPanOnNodeFocus}
              onChange={(event) => setAutoPanOnNodeFocus(event.target.checked)}
              className="xy-theme__checkbox"
            />
            autoPanOnNodeFocus
          </label>
        </div>
      </Panel>
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

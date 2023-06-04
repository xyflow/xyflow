import ReactFlow, { MiniMap, Background, BackgroundVariant, Controls, ReactFlowProvider, Node, Edge } from 'reactflow';

import TextInputNode from './TextInputNode';
import TextTranslateNode from './TextTranslateNode';
import DebugNode from './DebugNode';

const nodeTypes = {
  'text-input': TextInputNode,
  'text-translate': TextTranslateNode,
  debug: DebugNode,
};

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'text-input',
    data: { label: 'Node 1' },
    position: { x: 100, y: 0 },
    className: 'light',
  },
  {
    id: '2',
    type: 'text-translate',
    data: { label: 'Node 2' },
    position: { x: 100, y: 100 },
    className: 'light',
  },
  {
    id: '3',
    type: 'debug',
    data: { label: 'Node 2' },
    position: { x: -100, y: 100 },
    className: 'light',
  },
  {
    id: '4',
    type: 'debug',
    data: { label: 'Node 2' },
    position: { x: -100, y: 200 },
    className: 'light',
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', sourceHandle: 'text-output', target: '2', targetHandle: 'text-input', animated: true },
];

const defaultEdgeOptions = {};

const ConnectorsFlow = () => {
  return (
    <ReactFlow
      defaultNodes={initialNodes}
      defaultEdges={initialEdges}
      className="react-flow-basic-example"
      minZoom={0.2}
      maxZoom={4}
      fitView
      fitViewOptions={{ padding: 2 }}
      nodeTypes={nodeTypes}
      defaultEdgeOptions={defaultEdgeOptions}
      selectNodesOnDrag={false}
      elevateEdgesOnSelect
      elevateNodesOnSelect={false}
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
      <ConnectorsFlow />
    </ReactFlowProvider>
  );
}

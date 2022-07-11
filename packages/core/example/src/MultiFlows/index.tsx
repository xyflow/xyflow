import { FC } from 'react';

import ReactFlow, {
  addEdge,
  Background,
  Node,
  Edge,
  Connection,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  MarkerType,
} from 'react-flow-renderer';

import './multiflows.css';

const initialNodes: Node[] = [
  { id: '1', type: 'input', data: { label: 'Node 1' }, position: { x: 250, y: 5 }, className: 'light' },
  { id: '2', data: { label: 'Node 2' }, position: { x: 100, y: 100 }, className: 'light' },
  { id: '3', data: { label: 'Node 3' }, position: { x: 400, y: 100 }, className: 'light' },
  { id: '4', data: { label: 'Node 4' }, position: { x: 400, y: 200 }, className: 'light' },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true, markerEnd: { type: MarkerType.Arrow } },
  { id: 'e1-3', source: '1', target: '3' },
];

const Flow: FC<{ id: string }> = ({ id }) => {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds));

  return (
    <ReactFlowProvider>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        id={id}
      >
        <Background />
      </ReactFlow>
    </ReactFlowProvider>
  );
};

const MultiFlows: FC = () => (
  <div className="react-flow__example-multiflows">
    <Flow id="flow-a" />
    <Flow id="flow-b" />
  </div>
);

export default MultiFlows;

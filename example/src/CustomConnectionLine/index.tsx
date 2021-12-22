import ReactFlow, {
  Node,
  addEdge,
  Background,
  BackgroundVariant,
  Connection,
  Edge,
  useNodesState,
  useEdgesState,
} from 'react-flow-renderer';

import ConnectionLine from './ConnectionLine';

const initialNodes: Node[] = [{ id: '1', type: 'input', data: { label: 'Node 1' }, position: { x: 250, y: 5 } }];
const initialEdges: Edge[] = [];

const ConnectionLineFlow = () => {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect = (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds));

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      connectionLineComponent={ConnectionLine}
      onConnect={onConnect}
    >
      <Background variant={BackgroundVariant.Lines} />
    </ReactFlow>
  );
};

export default ConnectionLineFlow;

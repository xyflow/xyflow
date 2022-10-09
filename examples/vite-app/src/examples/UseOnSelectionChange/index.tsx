import { useCallback } from 'react';
import ReactFlow, {
  addEdge,
  ReactFlowProvider,
  Node,
  Connection,
  Edge,
  useNodesState,
  useEdgesState,
  useOnSelectionChange,
  OnSelectionChangeParams,
} from 'reactflow';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'default',
    data: { label: 'Node 1' },
    position: { x: 250, y: 5 },
  },
];

const SelectionLogger = () => {
  const onChange = useCallback(({ nodes, edges }: OnSelectionChangeParams) => {
    console.log(nodes, edges);
  }, []);

  useOnSelectionChange({
    onChange,
  });

  return null;
};

const Flow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const onConnect = useCallback((params: Edge | Connection) => setEdges((els) => addEdge(params, els)), [setEdges]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
    />
  );
};

const WrappedFlow = () => (
  <ReactFlowProvider>
    <Flow />
    <SelectionLogger />
  </ReactFlowProvider>
);

export default WrappedFlow;

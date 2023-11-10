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
  {
    id: '2',
    type: 'default',
    data: { label: 'Node 2' },
    position: { x: 250, y: 100 },
  },
];

const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
  },
];

const SelectionLogger = ({ id }: { id: string }) => {
  const onChange = useCallback(({ nodes, edges }: OnSelectionChangeParams) => {
    console.log(id, nodes, edges);
  }, []);

  useOnSelectionChange({
    onChange,
  });

  return null;
};

const Flow = () => {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
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
    <SelectionLogger id="Logger 1" />
    <SelectionLogger id="Logger 2" />
  </ReactFlowProvider>
);

export default WrappedFlow;

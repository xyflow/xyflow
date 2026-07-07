import { useCallback, useEffect } from 'react';
import { ReactFlow, addEdge, Node, Connection, Edge, useNodesState, useEdgesState, MiniMap, Controls } from '@xyflow/react';
import ReactFlowDevTools from '../DevTools/DevTools';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    hidden: true,
    data: { label: 'Node 1' },
    position: { x: 250, y: 5 },
  },
  {
    id: '2',
    hidden: true,
    data: { label: 'Node 2' },
    position: { x: 100, y: 100 },
  },
  {
    id: '3',
    hidden: true,
    data: { label: 'Node 3' },
    position: { x: 400, y: 100 },
  },
  {
    id: '4',
    hidden: true,
    data: { label: 'Node 4' },
    position: { x: 400, y: 200 },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e1-3', source: '1', target: '3' },
  { id: 'e3-4', source: '3', target: '4' },
];

const setHidden = (hidden: boolean) => (elements: { hidden?: boolean }[]) =>
  elements.map((element) => ({ ...element, hidden }));

export type HiddenExampleProps = {
  isHidden?: boolean;
};

export function HiddenExample({ isHidden = true }: HiddenExampleProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge(connection, eds));
    },
    [setEdges]
  );

  useEffect(() => {
    setNodes(setHidden(isHidden));
    setEdges(setHidden(isHidden));
  }, [isHidden, setEdges, setNodes]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onConnect={onConnect}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
    >
      <MiniMap />
      <Controls />
      <ReactFlowDevTools position="top-right" />
    </ReactFlow>
  );
}

export default HiddenExample;

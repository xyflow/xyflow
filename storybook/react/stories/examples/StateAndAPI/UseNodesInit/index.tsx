import { useCallback, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  MiniMap,
  Node,
  addEdge,
  ReactFlowProvider,
  Edge,
  useNodesState,
  useEdgesState,
  OnConnect,
  useNodesInitialized,
  Panel,
  useReactFlow,
} from '@xyflow/react';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Node 1' },
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
  {
    id: '4',
    data: { label: 'Node 4' },
    position: { x: 400, y: 200 },
    className: 'light',
    hidden: true,
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3' },
  // { id: 'e3-4', source: '3', target: '4' }
];

const UseZoomPanHelperFlow = () => {
  const { addNodes } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect: OnConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);
  const initialized = useNodesInitialized();

  useEffect(() => {
    console.log('initialized', initialized);
  }, [initialized]);

  const addNode = () =>
    addNodes({
      id: `${Math.random()}`,
      data: { label: 'new node' },
      position: { x: Math.random() * 400, y: Math.random() * 400 },
    });

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      fitView
      maxZoom={Infinity}
    >
      <Background />
      <MiniMap />
      <Panel>
        <button onClick={addNode}>add node</button>
      </Panel>
    </ReactFlow>
  );
};

const WrappedFlow = () => (
  <ReactFlowProvider>
    <UseZoomPanHelperFlow />
  </ReactFlowProvider>
);

export default WrappedFlow;

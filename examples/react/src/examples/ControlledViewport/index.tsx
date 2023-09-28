import { MouseEvent, useCallback, useState } from 'react';
import {
  ReactFlow,
  addEdge,
  Node,
  Connection,
  Edge,
  useNodesState,
  useEdgesState,
  Viewport,
  Panel,
  MiniMap,
  Background,
  ReactFlowProvider,
  useReactFlow,
  Controls,
} from '@xyflow/react';

const initNodes: Node[] = [
  {
    id: '1a',
    type: 'input',
    data: { label: 'Node 1' },
    position: { x: 250, y: 5 },
    className: 'light',
    ariaLabel: 'Input Node 1',
  },
  {
    id: '2a',
    data: { label: 'Node 2' },
    position: { x: 100, y: 100 },
    className: 'light',
    ariaLabel: 'Default Node 2',
  },
  {
    id: '3a',
    data: { label: 'Node 3' },
    position: { x: 400, y: 100 },
    className: 'light',
  },
  {
    id: '4a',
    data: { label: 'Node 4' },
    position: { x: 400, y: 200 },
    className: 'light',
  },
];

const initEdges: Edge[] = [
  { id: 'e1-2', source: '1a', target: '2a', ariaLabel: undefined },
  { id: 'e1-3', source: '1a', target: '3a' },
];

const Flow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initEdges);
  const [viewport, setViewport] = useState<Viewport>({ x: 0, y: 0, zoom: 1 });
  const { fitView } = useReactFlow();

  const onConnect = useCallback((params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      viewport={viewport}
      onViewportChange={setViewport}
    >
      <Panel position="top-left">
        <button onClick={() => setViewport((vp) => ({ ...vp, y: vp.y + 10 }))}>update viewport</button>
        <button onClick={() => fitView()}>fitView</button>
      </Panel>

      <MiniMap />
      <Background />
      <Controls />
    </ReactFlow>
  );
};

export default () => (
  <ReactFlowProvider>
    <Flow />
  </ReactFlowProvider>
);

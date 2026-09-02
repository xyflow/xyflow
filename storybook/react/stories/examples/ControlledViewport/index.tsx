import { useCallback, useState } from 'react';
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

import { defaultFlowProps } from '@shared/defaultFlow';

const { nodes: initialNodes = [], edges: initialEdges = [], fitViewOptions } = defaultFlowProps;

const Flow = () => {
  const [nodes, _, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [viewport, setViewport] = useState<Viewport>({ x: 0, y: 0, zoom: 1 });
  const [viewport2, setViewport2] = useState<Viewport>({ x: 100, y: 100, zoom: 1.5 });
  const [currentViewport, setCurrentViewport] = useState(0);
  const { fitView } = useReactFlow();

  const onConnect = useCallback((params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const setter = currentViewport === 0 ? setViewport : setViewport2;

  return (
    <ReactFlow
      defaultNodes={initialNodes}
      defaultEdges={initialEdges}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      viewport={currentViewport === 0 ? viewport : viewport2}
      onViewportChange={setter}
    >
      <Panel position="top-left">
        <button onClick={() => setter((vp) => ({ ...vp, y: vp.y + 10 }))}>update viewport</button>
        <button onClick={() => fitView()}>fitView</button>
        <button onClick={() => setCurrentViewport(currentViewport === 0 ? 1 : 0)}>toggle viewport</button>
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

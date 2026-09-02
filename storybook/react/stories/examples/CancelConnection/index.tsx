import {
  ReactFlow,
  Background,
  MiniMap,
  addEdge,
  ReactFlowProvider,
  Connection,
  Edge,
  useNodesState,
  useEdgesState,
  OnConnectStart,
  OnConnectEnd,
  useReactFlowStore,
} from '@xyflow/react';

import useCountdown from './hooks/useCountdown';
import Timer from './Timer';

import { defaultFlowProps } from '@shared/defaultFlow';

const { nodes: initialNodes = [], edges: initialEdges = [] } = defaultFlowProps;

const CANCEL_AFTER = 5; // seconds

const CancelConnection = () => {
  const [nodes, _, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const cancelConnection = useReactFlowStore((state) => state.cancelConnection);

  // Cancels connection after 5 seconds
  const countdown = useCountdown(() => cancelConnection());
  const onConnectStart: OnConnectStart = () => countdown.start(CANCEL_AFTER);
  const onConnectEnd: OnConnectEnd = () => countdown.stop();

  const onConnect = (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds));

  return (
    <>
      <Timer duration={CANCEL_AFTER} show={countdown.counting} remaining={countdown.remaining} />
      <ReactFlow
        defaultNodes={initialNodes}
        defaultEdges={initialEdges}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        onConnect={onConnect}
        fitView
        maxZoom={2}
      >
        <Background />
        <MiniMap />
      </ReactFlow>
    </>
  );
};

export default () => (
  <ReactFlowProvider>
    <CancelConnection />
  </ReactFlowProvider>
);

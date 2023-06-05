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
  useStore,
} from '@xyflow/react';

import useCountdown from './hooks/useCountdown';
import { initialEdges, initialNodes } from './data';
import Timer from './Timer';

const CANCEL_AFTER = 5; // seconds

const CancelConnection = () => {
  const [nodes, _, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const cancelConnection = useStore((state) => state.cancelConnection);

  // Cancels connection after 5 seconds
  const countdown = useCountdown(() => cancelConnection());
  const onConnectStart: OnConnectStart = () => countdown.start(CANCEL_AFTER);
  const onConnectEnd: OnConnectEnd = () => countdown.stop();

  const onConnect = (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds));

  return (
    <>
      <Timer duration={CANCEL_AFTER} show={countdown.counting} remaining={countdown.remaining} />
      <ReactFlow
        nodes={nodes}
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

import { useCallback } from 'react';
import ReactFlow, {
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  Position,
  Connection,
  addEdge,
} from 'react-flow-renderer';

import './touch-device.css';

const initialNodes: Node[] = [
  {
    id: '1',
    data: { label: 'Node 1' },
    position: { x: 100, y: 100 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  {
    id: '2',
    data: { label: 'Node 2' },
    position: { x: 300, y: 100 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
];

const initialEdges: Edge[] = [];

const TouchDeviceFlow = () => {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect = useCallback((connection: Connection) => setEdges((eds) => addEdge(connection, eds)), [setEdges]);
  const onConnectStart = useCallback(() => console.log('connect start'), []);
  const onConnectStop = useCallback(() => console.log('connect end'), []);
  const onClickConnectStart = useCallback(() => console.log('click connect start'), []);
  const onClickConnectStop = useCallback(() => console.log('click connect end'), []);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onConnect={onConnect}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnectStart={onConnectStart}
      onConnectStop={onConnectStop}
      onClickConnectStart={onClickConnectStart}
      onClickConnectStop={onClickConnectStop}
      className="touchdevice-flow"
    />
  );
};

export default TouchDeviceFlow;

import { MouseEvent, useCallback } from 'react';
import {
  ReactFlow,
  useReactFlow,
  NodeTypes,
  addEdge,
  ReactFlowProvider,
  Node,
  Connection,
  Edge,
  ConnectionLineType,
  ConnectionMode,
  reconnectEdge,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';

import CustomNode from './CustomNode';

const initialNodes: Node[] = [
  {
    id: '00',
    type: 'custom',
    position: { x: 300, y: 250 },
    data: {},
  },
  {
    id: '01',
    type: 'custom',
    position: { x: 100, y: 50 },
    data: {},
  },
  {
    id: '02',
    type: 'custom',
    position: { x: 500, y: 50 },
    data: {},
  },
  {
    id: '03',
    type: 'custom',
    position: { x: 500, y: 500 },
    data: {},
  },
  {
    id: '04',
    type: 'custom',
    position: { x: 100, y: 500 },
    data: {},
  },
  {
    id: '10',
    type: 'custom',
    position: { x: 300, y: 5 },
    data: {},
  },
  {
    id: '20',
    type: 'custom',
    position: { x: 600, y: 250 },
    data: {},
  },
  {
    id: '30',
    type: 'custom',
    position: { x: 300, y: 600 },
    data: {},
  },
  {
    id: '40',
    type: 'custom',
    position: { x: 5, y: 250 },
    data: {},
  },
];

const initialEdges: Edge[] = [
  {
    id: 'e0-1a',
    source: '00',
    target: '01',
    sourceHandle: 'left',
    targetHandle: 'bottom',
    type: 'smoothstep',
  },
  {
    id: 'e0-1b',
    source: '00',
    target: '01',
    sourceHandle: 'top',
    targetHandle: 'right',
    type: 'smoothstep',
  },
  {
    id: 'e0-2a',
    source: '00',
    target: '02',
    sourceHandle: 'top',
    targetHandle: 'left',
    type: 'smoothstep',
  },
  {
    id: 'e0-2b',
    source: '00',
    target: '02',
    sourceHandle: 'right',
    targetHandle: 'bottom',
    type: 'smoothstep',
  },
  {
    id: 'e0-3a',
    source: '00',
    target: '03',
    sourceHandle: 'right',
    targetHandle: 'top',
    type: 'smoothstep',
  },
  {
    id: 'e0-3b',
    source: '00',
    target: '03',
    sourceHandle: 'bottom',
    targetHandle: 'left',
    type: 'smoothstep',
  },
  {
    id: 'e0-4a',
    source: '00',
    target: '04',
    sourceHandle: 'bottom',
    targetHandle: 'right',
    type: 'smoothstep',
  },
  {
    id: 'e0-4b',
    source: '00',
    target: '04',
    sourceHandle: 'left',
    targetHandle: 'top',
    type: 'smoothstep',
  },
  {
    id: 'e0-10',
    source: '00',
    target: '10',
    sourceHandle: 'top',
    targetHandle: 'bottom',
    type: 'smoothstep',
  },
  {
    id: 'e0-20',
    source: '00',
    target: '20',
    sourceHandle: 'right',
    targetHandle: 'left',
    type: 'smoothstep',
  },
  {
    id: 'e0-30',
    source: '00',
    target: '30',
    sourceHandle: 'bottom',
    targetHandle: 'top',
    type: 'smoothstep',
  },
  {
    id: 'e0-40',
    source: '00',
    target: '40',
    sourceHandle: 'left',
    targetHandle: 'right',
    type: 'smoothstep',
  },
];

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

let id = 4;
const getId = () => `${id++}`;

const UpdateNodeInternalsFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { screenToFlowPosition } = useReactFlow();

  const onConnect = useCallback((params: Edge | Connection) => setEdges((els) => addEdge(params, els)), [setEdges]);
  const onReconnect = useCallback(
    (oldEdge: Edge, newConnection: Connection) => setEdges((els) => reconnectEdge(oldEdge, newConnection, els)),
    []
  );

  const onPaneClick = useCallback(
    (evt: MouseEvent) =>
      setNodes((nds) =>
        nds.concat({
          id: getId(),
          position: screenToFlowPosition({ x: evt.clientX, y: evt.clientY }),
          type: 'custom',
          data: null,
        })
      ),
    [screenToFlowPosition, setNodes]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      onConnect={onConnect}
      onPaneClick={onPaneClick}
      connectionLineType={ConnectionLineType.Bezier}
      connectionMode={ConnectionMode.Loose}
      onReconnect={onReconnect}
    />
  );
};

const WrappedFlow = () => (
  <ReactFlowProvider>
    <UpdateNodeInternalsFlow />
  </ReactFlowProvider>
);

export default WrappedFlow;

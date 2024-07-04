import { useCallback, MouseEvent } from 'react';
import {
  ReactFlow,
  NodeTypes,
  addEdge,
  useReactFlow,
  ReactFlowProvider,
  Node,
  Connection,
  Edge,
  Position,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';

import CustomNode from './CustomNode';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'custom',
    data: { label: 'Node 1' },
    position: { x: 250, y: 5 },
  },
];

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

let id = 5;
const getId = (): string => `${id++}`;

const UpdateNodeInternalsFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const onConnect = useCallback((params: Edge | Connection) => setEdges((els) => addEdge(params, els)), [setEdges]);

  const { screenToFlowPosition } = useReactFlow();

  const onPaneClick = useCallback(
    (evt: MouseEvent) =>
      setNodes((nds) =>
        nds.concat({
          id: getId(),
          position: screenToFlowPosition({ x: evt.clientX, y: evt.clientY }),
          data: { label: 'new node' },
          targetPosition: Position.Left,
          sourcePosition: Position.Right,
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
    />
  );
};

const WrappedFlow = () => (
  <ReactFlowProvider>
    <UpdateNodeInternalsFlow />
  </ReactFlowProvider>
);

export default WrappedFlow;

import { useState, useCallback, useEffect } from 'react';
import {
  ReactFlow,
  Controls,
  addEdge,
  Node,
  Position,
  useEdgesState,
  Background,
  applyNodeChanges,
  OnNodesChange,
  OnConnect,
  BuiltInNode,
  BuiltInEdge,
  NodeTypes,
  ReactFlowProvider,
  useConnection,
  useReactFlow,
  useUpdateNodeInternals,
} from '@xyflow/react';

import MovingHandleNode from './MovingHandleNode';

export type MovingHandleNode = Node<{}, 'movingHandle'>;
export type MyNode = BuiltInNode | MovingHandleNode;
export type MyEdge = BuiltInEdge;

const nodeTypes: NodeTypes = {
  movingHandle: MovingHandleNode,
};

const initNodes: MyNode[] = [
  {
    id: 'input',
    type: 'input',
    data: { label: 'input' },
    position: { x: -300, y: 0 },
    sourcePosition: Position.Right,
  },
];

for (let i = 0; i < 10; i++) {
  initNodes.push({
    id: `${i}`,
    type: 'movingHandle',
    position: { x: 0, y: i * 60 },
    data: {},
  });
}

const initEdges: MyEdge[] = [];

const CustomNodeFlow = () => {
  const [nodes, setNodes] = useState<MyNode[]>(initNodes);

  const onNodesChange: OnNodesChange<MyNode> = useCallback(
    (changes) =>
      setNodes((nds) => {
        const nextNodes = applyNodeChanges(changes, nds);
        return nextNodes;
      }),
    [setNodes]
  );

  const [edges, setEdges, onEdgesChange] = useEdgesState<MyEdge>(initEdges);

  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge({ ...connection, animated: true }, eds)),
    [setEdges]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      minZoom={0.2}
      fitView
    >
      <Controls />
      <Background />
      <NodeUpdater />
    </ReactFlow>
  );
};

function NodeUpdater() {
  const connection = useConnection();
  const { getNodes } = useReactFlow();
  const updateNodeInternals = useUpdateNodeInternals();

  useEffect(() => {
    const startTime = Date.now();
    const nodeIds = getNodes().map((n) => n.id);

    function update() {
      if (Date.now() - startTime < 500) {
        updateNodeInternals(nodeIds);
        requestAnimationFrame(update);
      }
    }

    update();
  }, [connection.inProgress]);

  return null;
}

export default () => (
  <ReactFlowProvider>
    <CustomNodeFlow />
  </ReactFlowProvider>
);

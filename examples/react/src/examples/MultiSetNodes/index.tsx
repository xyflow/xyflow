import { useCallback } from 'react';
import {
  ReactFlow,
  Controls,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Background,
  Node,
  Edge,
  Panel,
  useReactFlow,
  ReactFlowProvider,
} from '@xyflow/react';

const initNodes: Node[] = [
  {
    id: '1',
    data: {
      label: 'hallo',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: '2',
    data: {
      label: 'world',
    },
    position: { x: 200, y: 0 },
  },
];

const initEdges: Edge[] = [];

const CustomNodeFlow = () => {
  const { setNodes } = useReactFlow();
  const [nodes, , onNodesChange] = useNodesState(initNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initEdges);

  const onConnect = useCallback((connection: Connection) => setEdges((eds) => addEdge(connection, eds)), [setEdges]);

  const updateNodes = () => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === '1') {
          return { ...n, data: { label: 'updated' } };
        }

        return n;
      })
    );

    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === '2') {
          return { ...n, data: { label: 'updated' } };
        }

        return n;
      })
    );
  };

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      fitView
    >
      <Controls />
      <Background />
      <Panel>
        <button onClick={updateNodes}>update nodes</button>
      </Panel>
    </ReactFlow>
  );
};

export default () => (
  <ReactFlowProvider>
    <CustomNodeFlow />
  </ReactFlowProvider>
);

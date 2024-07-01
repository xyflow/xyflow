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

import './style.css';

const initNodes: Node[] = [];

for (let i = 0; i < 100; i++) {
  initNodes.push({
    id: i.toString(),
    data: {
      label: `node ${i + 1}`,
    },
    position: { x: (i % 10) * 60, y: Math.floor(i / 10) * 60 },
  });
}

const initEdges: Edge[] = initNodes.reduce<Edge[]>((res, node, index) => {
  if (index > 0) {
    res.push({ id: `${index - 1}-${index}`, source: (index - 1).toString(), target: index.toString() });
  }
  return res;
}, []);

const CustomNodeFlow = () => {
  const { setNodes, updateNodeData, updateEdge } = useReactFlow();
  const [nodes, , onNodesChange] = useNodesState(initNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initEdges);

  const onConnect = useCallback((connection: Connection) => setEdges((eds) => addEdge(connection, eds)), [setEdges]);

  const multiSetNodes = () => {
    nodes.forEach((node) =>
      setNodes((nds) =>
        nds.map((n) => {
          if (n.id === node.id) {
            return { ...n, data: { label: 'node set' } };
          }

          return n;
        })
      )
    );
  };

  const multiUpdateNodes = () => {
    nodes.forEach((node) => updateNodeData(node.id, { label: 'node update' }));
  };

  const multiUpdateEdges = () => {
    edges.forEach((edge) => updateEdge(edge.id, { label: 'edge update' }));
  };

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      fitView
      className="multiset"
    >
      <Controls />
      <Background />
      <Panel>
        <button onClick={multiSetNodes}>set nodes</button>
        <button onClick={multiUpdateNodes}>update nodes</button>
        <button onClick={multiUpdateEdges}>update edges</button>
      </Panel>
    </ReactFlow>
  );
};

export default () => (
  <ReactFlowProvider>
    <CustomNodeFlow />
  </ReactFlowProvider>
);

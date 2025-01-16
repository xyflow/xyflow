import { useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Background,
} from '@xyflow/react';

import MultiHandleNode from './MultiHandleNode';
import SingleHandleNode from './SingleHandleNode';

const nodeTypes = {
  multi: MultiHandleNode,
  single: SingleHandleNode,
};

const initNodes = [
  {
    id: '1',
    type: 'single',
    data: {},
    position: { x: 0, y: 0 },
  },
  {
    id: '2',
    type: 'single',
    data: {},
    position: { x: 200, y: -100 },
  },
  {
    id: '3',
    type: 'single',
    data: {},
    position: { x: 200, y: 100 },
  },

  {
    id: '4',
    type: 'multi',
    data: {},
    position: { x: 400, y: 0 },
  },
  {
    id: '5',
    type: 'multi',
    data: {},
    position: { x: 600, y: -100 },
  },
  {
    id: '6',
    type: 'multi',
    data: {},
    position: { x: 600, y: 100 },
  },
];

const initEdges = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
  },
  {
    id: 'e1-3',
    source: '1',
    target: '3',
  },
  {
    id: 'e4a-5',
    source: '4',
    sourceHandle: 's1',
    target: '5',
  },
  {
    id: 'e4b-5',
    source: '4',
    sourceHandle: 's2',
    target: '6',
  },
];

const defaultEdgeOptions = {
  animated: true,
};

const CustomNodeFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initEdges);

  console.log(edges);

  const onConnect = useCallback((connection: Connection) => setEdges((eds) => addEdge(connection, eds)), [setEdges]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      fitView
      minZoom={0.3}
      maxZoom={2}
      colorMode="dark"
      defaultEdgeOptions={defaultEdgeOptions}
    >
      <MiniMap />
      <Controls />
      <Background />
    </ReactFlow>
  );
};

export default CustomNodeFlow;

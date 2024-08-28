import { useCallback } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  addEdge,
  useNodesState,
  useEdgesState,
  MarkerType,
  OnConnect,
  ConnectionMode,
} from '@xyflow/react';

import CustomNode from './CustomNode';
import FloatingEdge from './FloatingEdge';
import CustomConnectionLine from './CustomConnectionLine';

import './style.css';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'custom',
    position: { x: 0, y: 0 },
    data: {},
  },
  {
    id: '2',
    type: 'custom',
    position: { x: 250, y: 320 },
    data: {},
  },
  {
    id: '3',
    type: 'custom',
    position: { x: 40, y: 300 },
    data: {},
  },
  {
    id: '4',
    type: 'custom',
    position: { x: 300, y: 0 },
    data: {},
  },
];

const initialEdges: Edge[] = [];

const connectionLineStyle = {
  strokeWidth: 3,
  stroke: 'black',
};

const nodeTypes = {
  custom: CustomNode,
};

const edgeTypes = {
  floating: FloatingEdge,
};

const defaultEdgeOptions = {
  style: { strokeWidth: 3, stroke: 'black' },
  type: 'floating',
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: 'black',
  },
};

const EasyConnectExample = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect: OnConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      fitView
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      defaultEdgeOptions={defaultEdgeOptions}
      connectionLineComponent={CustomConnectionLine}
      connectionLineStyle={connectionLineStyle}
    />
  );
};

export default EasyConnectExample;

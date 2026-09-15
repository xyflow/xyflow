import { CSSProperties, useCallback } from 'react';
import { ReactFlow, addEdge, Node, Position, Connection, Edge, useNodesState, useEdgesState } from '@xyflow/react';

const initialNodes: Node[] = [
  {
    id: '1',
    sourcePosition: Position.Right,
    type: 'input',
    data: { label: 'Input' },
    position: { x: 0, y: 80 },
  },
  {
    id: '2',
    type: 'output',
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    data: { label: 'A Node' },
    position: { x: 250, y: 0 },
  },
];

const initialEdges: Edge[] = [{ id: 'e1-2', source: '1', type: 'smoothstep', target: '2', animated: true }];

const buttonStyle: CSSProperties = {
  position: 'absolute',
  right: 10,
  top: 30,
  zIndex: 4,
};

const NodeTypeChangeFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect = useCallback((params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)), [setEdges]);
  const changeType = () => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.type === 'input') {
          return node;
        }

        return {
          ...node,
          type: node.type === 'default' ? 'output' : 'default',
        };
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
      <button onClick={changeType} style={buttonStyle}>
        change type
      </button>
    </ReactFlow>
  );
};

export default NodeTypeChangeFlow;

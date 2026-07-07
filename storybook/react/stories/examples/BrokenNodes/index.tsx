import { useCallback, useState } from 'react';
import { ReactFlow, addEdge, Node, Connection, Edge, OnNodeDrag } from '@xyflow/react';

const nodesInit: Node[] = [
  {
    id: '1a',
    type: 'input',
    data: { label: 'Node 1' },
    position: { x: 250, y: 5 },
    className: 'light',
    ariaLabel: 'Input Node 1',
  },
  {
    id: '2a',
    data: { label: 'Node 2' },
    position: { x: 100, y: 100 },
    className: 'light',
    ariaLabel: 'Default Node 2',
  },
  {
    id: '3a',
    data: { label: 'Node 3' },
    position: { x: 400, y: 100 },
    className: 'light',
  },
  {
    id: '4a',
    data: { label: 'Node 4' },
    position: { x: 400, y: 200 },
    className: 'light',
  },
];

const edgesInit: Edge[] = [
  { id: 'e1-2', source: '1a', target: '2a', ariaLabel: undefined },
  { id: 'e1-3', source: '1a', target: '3a' },
];

const onNodesChange = () => {};
const onEdgesChange = () => {};
const BasicFlow = () => {
  const [nodes, setNodes] = useState(nodesInit);
  const [edges, setEdges] = useState(edgesInit);

  const onConnect = useCallback((params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const onNodeDrag: OnNodeDrag = useCallback((e, node) => {
    if (isNaN(node.position.x) || isNaN(node.position.y)) {
      console.log('received NaN', node.position);
    }

    setNodes((nds) => {
      return nds.map((item) => {
        if (item.id === node.id) {
          return {
            ...item,
            position: {
              x: node.position.x,
              y: node.position.y,
            },
          };
        }
        return item;
      });
    });
  }, []);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeDrag={onNodeDrag}
    ></ReactFlow>
  );
};

export default BasicFlow;

import { useCallback, useState } from 'react';
import { ReactFlow, addEdge, Node, Connection, Edge, OnNodeDrag } from '@xyflow/react';

import { defaultFlowProps } from '@shared/defaultFlow';

const { nodes: initialNodes = [], edges: initialEdges = [], fitViewOptions } = defaultFlowProps;

const onNodesChange = () => {};
const onEdgesChange = () => {};
const BasicFlow = () => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

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
      defaultNodes={initialNodes}
      defaultEdges={initialEdges}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeDrag={onNodeDrag}
    ></ReactFlow>
  );
};

export default BasicFlow;

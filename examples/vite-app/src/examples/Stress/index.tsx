import { useState, CSSProperties, useCallback } from 'react';
import ReactFlow, {
  Edge,
  Node,
  NodeChange,
  applyNodeChanges,
  Connection,
  addEdge,
  applyEdgeChanges,
  EdgeChange,
  Controls,
  Background,
  MiniMap,
} from 'reactflow';

import { getNodesAndEdges } from './utils';

const buttonWrapperStyles: CSSProperties = {
  position: 'absolute',
  right: 10,
  top: 10,
  zIndex: 4,
};

const { nodes: initialNodes, edges: initialEdges } = getNodesAndEdges(25, 25);

const StressFlow = () => {
  const [key, setKey] = useState(0);
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const onConnect = useCallback((connection: Connection) => {
    setEdges((eds) => addEdge(connection, eds));
  }, []);
  const updatePos = () => {
    setNodes((nds) => {
      return nds.map((n) => {
        return {
          ...n,
          position: {
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          },
        };
      });
    });
  };

  const updateElements = () => {
    const grid = Math.ceil(Math.random() * 10);
    const initialElements = getNodesAndEdges(grid, grid);
    setNodes(initialElements.nodes);
    setEdges(initialElements.edges);
  };

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((ns) => applyNodeChanges(changes, ns));
  }, []);

  const onEdgeChange = useCallback((changes: EdgeChange[]) => {
    setEdges((es) => applyEdgeChanges(changes, es));
  }, []);

  return (
    <ReactFlow
      key={key}
      nodes={nodes}
      edges={edges}
      onConnect={onConnect}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgeChange}
      fitView
    >
      <MiniMap />
      <Controls />
      <Background />

      <div style={buttonWrapperStyles}>
        <button onClick={updatePos}>change pos</button>
        <button onClick={updateElements}>update elements</button>
        <button onClick={() => setKey((k) => k + 1)}>re-mount</button>
      </div>
    </ReactFlow>
  );
};

export default StressFlow;

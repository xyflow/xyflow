import { useState, CSSProperties, useCallback } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  ReactFlowInstance,
  Edge,
  Node,
  NodeChange,
  applyNodeChanges,
  Connection,
  addEdge,
} from 'react-flow-renderer';

import { getNodesAndEdges } from './utils';

const buttonWrapperStyles: CSSProperties = { position: 'absolute', right: 10, top: 10, zIndex: 4 };

const onInit = (reactFlowInstance: ReactFlowInstance) => {
  reactFlowInstance.fitView();
  console.log(reactFlowInstance.getNodes());
};

const { nodes: initialNodes, edges: initialEdges } = getNodesAndEdges(30, 30);

const StressFlow = () => {
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

  return (
    <ReactFlow nodes={nodes} edges={edges} onInit={onInit} onConnect={onConnect} onNodesChange={onNodesChange}>
      <MiniMap />
      <Controls />
      <Background />

      <div style={buttonWrapperStyles}>
        <button onClick={updatePos} style={{ marginRight: 5 }}>
          change pos
        </button>
        <button onClick={updateElements}>update elements</button>
      </div>
    </ReactFlow>
  );
};

export default StressFlow;

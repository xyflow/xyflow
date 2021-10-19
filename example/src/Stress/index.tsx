import { useState, CSSProperties, useCallback } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  OnLoadParams,
  Edge,
  Node,
  NodeChange,
  applyNodeChanges,
} from 'react-flow-renderer';

import { getElements } from './utils';

const buttonWrapperStyles: CSSProperties = { position: 'absolute', right: 10, top: 10, zIndex: 4 };

const onLoad = (reactFlowInstance: OnLoadParams) => {
  reactFlowInstance.fitView();
  console.log(reactFlowInstance.getElements());
};

const initialElements = getElements(30, 30);

const StressFlow = () => {
  const [nodes, setNodes] = useState<Node[]>(initialElements.nodes);
  const [edges, setEdges] = useState<Edge[]>(initialElements.edges);
  // const onElementsRemove = (elementsToRemove: Elements) => setElements((els) => removeElements(elementsToRemove, els));
  // const onConnect = (params: Connection | Edge, nds: Node[]) => setElements((els) => addEdge(params, els));

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
    const initialElements = getElements(grid, grid);
    setNodes(initialElements.nodes);
    setEdges(initialElements.edges);
  };

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((ns) => applyNodeChanges(changes, ns));
  }, []);

  return (
    <ReactFlow nodes={nodes} edges={edges} onLoad={onLoad} onNodesChange={onNodesChange}>
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

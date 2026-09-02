import {
  ReactFlow,
  useReactFlow,
  Node,
  Edge,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  Background,
  BackgroundVariant,
} from '@xyflow/react';

import { defaultFlowProps } from '@shared/defaultFlow';

const { nodes: initialNodes = [], edges: initialEdges = [], fitViewOptions } = defaultFlowProps;

const defaultEdgeOptions = {
  animated: true,
};

// This is bad practise. You should either use a controlled or an uncontrolled component.
// This is just an example for testing the API.
const ControlledUncontrolled = () => {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
  const instance = useReactFlow();

  const logToObject = () => console.log(instance.toObject());
  const resetTransform = () => instance.setViewport({ x: 0, y: 0, zoom: 1 });

  const updateNodePositions = () => {
    instance.setNodes((nodes) =>
      nodes.map((node) => {
        return {
          ...node,
          position: {
            x: Math.random() * 400,
            y: Math.random() * 400,
          },
        };
      })
    );
  };

  const updateEdgeColors = () => {
    instance.setEdges((edges) =>
      edges.map((edge) => {
        return {
          ...edge,
          style: {
            stroke: '#ff5050',
          },
        };
      })
    );
  };

  return (
    <ReactFlow
      defaultNodes={initialNodes}
      defaultEdges={initialEdges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      defaultEdgeOptions={defaultEdgeOptions}
      fitView
    >
      <Background variant={BackgroundVariant.Lines} />

      <div style={{ position: 'absolute', right: 10, top: 10, zIndex: 4 }}>
        <button onClick={resetTransform} style={{ marginRight: 5 }}>
          reset transform
        </button>
        <button onClick={updateNodePositions} style={{ marginRight: 5 }}>
          change pos
        </button>
        <button onClick={updateEdgeColors} style={{ marginRight: 5 }}>
          red edges
        </button>
        <button onClick={logToObject}>toObject</button>
      </div>
    </ReactFlow>
  );
};

export default function App() {
  return (
    <ReactFlowProvider>
      <ControlledUncontrolled />
    </ReactFlowProvider>
  );
}

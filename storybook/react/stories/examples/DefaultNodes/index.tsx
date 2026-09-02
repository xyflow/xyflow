import {
  ReactFlow,
  useReactFlow,
  Node,
  Edge,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  Panel,
} from '@xyflow/react';

import { defaultFlowProps } from '@shared/defaultFlow';

const { nodes: initialNodes = [], edges: initialEdges = [], fitViewOptions } = defaultFlowProps;

const defaultEdgeOptions = {
  animated: true,
};

const DefaultNodes = () => {
  const instance = useReactFlow();

  const logToObject = () => console.log(instance.toObject());
  const resetTransform = () => instance.setViewport({ x: 0, y: 0, zoom: 1 });

  const updateNodePositions = () => {
    instance.setNodes((nodes) =>
      nodes.map((node) => ({
        ...node,
        position: {
          x: Math.random() * 400,
          y: Math.random() * 400,
        },
      }))
    );
  };

  const updateEdgeColors = () => {
    instance.setEdges((edges) =>
      edges.map((edge) => ({
        ...edge,
        style: {
          stroke: '#ff5050',
        },
      }))
    );
  };

  return (
    <ReactFlow defaultNodes={initialNodes} defaultEdges={initialEdges} defaultEdgeOptions={defaultEdgeOptions} fitView>
      <Background variant={BackgroundVariant.Lines} />

      <Panel position="top-right">
        <button onClick={resetTransform}>reset transform</button>
        <button onClick={updateNodePositions}>change pos</button>
        <button onClick={updateEdgeColors}>red edges</button>
        <button onClick={logToObject}>toObject</button>
      </Panel>
    </ReactFlow>
  );
};

export default function App() {
  return (
    <ReactFlowProvider>
      <DefaultNodes />
    </ReactFlowProvider>
  );
}

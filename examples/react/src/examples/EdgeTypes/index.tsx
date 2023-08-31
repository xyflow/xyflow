import { useCallback } from 'react';

import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  ReactFlowInstance,
  Connection,
  Edge,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';

import { getElements } from './utils';

const onInit = (reactFlowInstance: ReactFlowInstance) => {
  reactFlowInstance.fitView();
  console.log(reactFlowInstance.getNodes());
};

const { nodes: initialNodes, edges: initialEdges } = getElements();

const multiSelectionKeyCode = ['ShiftLeft', 'ShiftRight'];
const deleteKeyCode = ['AltLeft+KeyD', 'Backspace'];

const EdgeTypesFlow = () => {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect = useCallback((params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onInit={onInit}
      onConnect={onConnect}
      minZoom={0.2}
      selectionKeyCode="a+s"
      multiSelectionKeyCode={multiSelectionKeyCode}
      deleteKeyCode={deleteKeyCode}
      zoomActivationKeyCode="z"
    >
      <MiniMap />
      <Controls />
      <Background />
    </ReactFlow>
  );
};

export default EdgeTypesFlow;

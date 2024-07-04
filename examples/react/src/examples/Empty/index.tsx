import { MouseEvent, CSSProperties, useCallback } from 'react';

import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  addEdge,
  Node,
  Connection,
  Edge,
  useNodesState,
  useEdgesState,
  ReactFlowInstance,
} from '@xyflow/react';

const onInit = (reactFlowInstance: ReactFlowInstance) => console.log('flow loaded:', reactFlowInstance);
const onNodeClick = (_: MouseEvent, node: Node) => console.log('click', node);
const onNodeDragStop = (_: MouseEvent, node: Node) => console.log('drag stop', node);

const buttonStyle: CSSProperties = {
  position: 'absolute',
  left: 10,
  top: 10,
  zIndex: 4,
};

const EmptyFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const onConnect = useCallback((params: Connection | Edge) => setEdges((els) => addEdge(params, els)), [setEdges]);
  const addRandomNode = () => {
    const nodeId = (nodes.length + 1).toString();
    const newNode: Node = {
      id: nodeId,
      data: { label: `Node: ${nodeId}` },
      position: {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
      },
    };
    setNodes((nds) => nds.concat(newNode));
  };

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onInit={onInit}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onNodeClick={onNodeClick}
      onConnect={(p) => onConnect(p)}
      onNodeDragStop={onNodeDragStop}
      onlyRenderVisibleElements={false}
    >
      <Controls />
      <Background variant={BackgroundVariant.Lines} />

      <button type="button" onClick={addRandomNode} style={buttonStyle}>
        add node
      </button>
    </ReactFlow>
  );
};

export default EmptyFlow;

import { MouseEvent, useCallback, useEffect } from 'react';

import {
  ReactFlow,
  addEdge,
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  Edge,
  MiniMap,
  MiniMapNodeProps,
  Node,
  ReactFlowInstance,
  useEdgesState,
  useNodesState,
  Panel,
} from '@xyflow/react';

const onInit = (reactFlowInstance: ReactFlowInstance) => console.log('flow loaded:', reactFlowInstance);
const onNodeClick = (_: MouseEvent, node: Node) => console.log('click', node);
const onNodeDragStop = (_: MouseEvent, node: Node) => console.log('drag stop', node);

const CustomMiniMapNode = ({ x, y, width, height }: MiniMapNodeProps) => {
  return <circle cx={x} cy={y} r={Math.max(width, height) / 2} fill="#ffcc00" />;
};

export type CustomMiniMapNodeExampleProps = {
  hideAllNodes?: boolean;
};

export function CustomMiniMapNodeExample({ hideAllNodes = false }: CustomMiniMapNodeExampleProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const onConnect = useCallback((params: Connection | Edge) => setEdges((els) => addEdge(params, els)), [setEdges]);

  useEffect(() => {
    setNodes((nds) => nds.map((n) => ({ ...n, hidden: hideAllNodes })));
    setEdges((eds) => eds.map((e) => ({ ...e, hidden: hideAllNodes })));
  }, [hideAllNodes, setEdges, setNodes]);

  const addRandomNode = () => {
    const nodeId = (nodes.length + 1).toString();
    const newNode: Node = {
      id: nodeId,
      data: { label: `Node: ${nodeId}` },
      position: {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
      },
      hidden: hideAllNodes,
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
      onlyRenderVisibleElements={true}
    >
      <Controls />
      <Background variant={BackgroundVariant.Lines} />
      <MiniMap nodeComponent={CustomMiniMapNode} />

      <Panel position="top-left">
        <button type="button" onClick={addRandomNode}>
          add node
        </button>
      </Panel>
    </ReactFlow>
  );
}

export default CustomMiniMapNodeExample;

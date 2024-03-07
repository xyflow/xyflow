import { useState, useEffect, MouseEvent, ChangeEvent, useCallback, useRef } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  addEdge,
  Node,
  Position,
  SnapGrid,
  useEdgesState,
  Background,
  OnNodeDrag,
  OnInit,
  applyNodeChanges,
  OnNodesChange,
  OnConnect,
  OnBeforeDelete,
  BuiltInNode,
  BuiltInEdge,
  NodeTypes,
  ReactFlowProvider,
} from '@xyflow/react';

import ColorSelectorNode from './ColorSelectorNode';

export type ColorSelectorNode = Node<
  { color: string; onChange: (event: ChangeEvent<HTMLInputElement>) => void },
  'selectorNode'
>;
export type MyNode = BuiltInNode | ColorSelectorNode;
export type MyEdge = BuiltInEdge;

const onInit: OnInit<MyNode, MyEdge> = (reactFlowInstance) => {
  console.log('flow loaded:', reactFlowInstance);
};

const onNodeDragStop: OnNodeDrag<MyNode> = (_, node) => console.log('drag stop', node);
const onNodeClick = (_: MouseEvent, node: MyNode) => console.log('click', node);

const initBgColor = '#1A192B';

const connectionLineStyle = { stroke: '#fff' };
const snapGrid: SnapGrid = [16, 16];

const nodeTypes: NodeTypes = {
  selectorNode: ColorSelectorNode,
};

const CustomNodeFlow = () => {
  const ref = useRef(null);
  const [nodes, setNodes] = useState<MyNode[]>([]);
  const onNodesChange: OnNodesChange<MyNode> = useCallback(
    (changes) =>
      setNodes((nds) => {
        const nextNodes = applyNodeChanges(changes, nds);
        return nextNodes;
      }),
    [setNodes]
  );

  const [edges, setEdges, onEdgesChange] = useEdgesState<MyEdge>([]);

  const [bgColor, setBgColor] = useState<string>(initBgColor);

  useEffect(() => {
    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id !== '2' || node.type !== 'selectorNode') {
            return node;
          }

          const color = event.target.value;

          setBgColor(color);

          return {
            ...node,
            data: {
              ...node.data,
              color,
            },
          };
        })
      );
    };

    setNodes([
      {
        id: '1',
        type: 'input',
        data: { label: 'An input node' },
        position: { x: 0, y: 50 },
        sourcePosition: Position.Right,
      },
      {
        id: '2',
        type: 'selectorNode',
        data: { onChange: onChange, color: initBgColor },
        style: { border: '1px solid #777', padding: 10 },
        position: { x: 250, y: 50 },
      },
      {
        id: '3',
        type: 'output',
        data: { label: 'Output A' },
        position: { x: 550, y: 25 },
        targetPosition: Position.Left,
      },
      {
        id: '4',
        type: 'output',
        data: { label: 'Output B' },
        position: { x: 550, y: 100 },
        targetPosition: Position.Left,
      },
    ]);

    setEdges([
      {
        id: 'e1-2',
        source: '1',
        target: '2',
        animated: true,
        style: { stroke: '#fff' },
      },
      {
        id: 'e2a-3',
        source: '2',
        sourceHandle: 'a',
        target: '3',
        animated: true,
        style: { stroke: '#fff' },
      },
      {
        id: 'e2b-4',
        source: '2',
        sourceHandle: 'b',
        target: '4',
        animated: true,
        style: { stroke: '#fff' },
      },
    ]);
  }, []);

  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge({ ...connection, animated: true, style: { stroke: '#fff' } }, eds)),
    [setEdges]
  );

  const onBeforeDelete: OnBeforeDelete<MyNode, MyEdge> = useCallback(async (params) => true, []);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onNodeClick={onNodeClick}
      onConnect={onConnect}
      onNodeDragStop={onNodeDragStop}
      onInit={onInit}
      nodeTypes={nodeTypes}
      connectionLineStyle={connectionLineStyle}
      snapToGrid={true}
      snapGrid={snapGrid}
      fitView
      minZoom={0.3}
      maxZoom={2}
      onBeforeDelete={onBeforeDelete}
      ref={ref}
    >
      <MiniMap<MyNode>
        nodeStrokeColor={(n: MyNode): string => {
          if (n.type === 'input') return '#0041d0';
          if (n.type === 'selectorNode') return bgColor;
          if (n.type === 'output') return '#ff0072';

          return '#eee';
        }}
        nodeColor={(n: MyNode): string => {
          if (n.type === 'selectorNode') return bgColor;

          return '#fff';
        }}
      />
      <Controls />
      <Background bgColor={bgColor} />
    </ReactFlow>
  );
};

export default () => (
  <ReactFlowProvider>
    <CustomNodeFlow />
  </ReactFlowProvider>
);

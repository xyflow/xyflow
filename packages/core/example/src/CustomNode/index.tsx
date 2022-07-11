import { useState, useEffect, MouseEvent } from 'react';
import { ChangeEvent } from 'react';

import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Node,
  ReactFlowInstance,
  Position,
  SnapGrid,
  Connection,
  useNodesState,
  useEdgesState,
} from 'react-flow-renderer';

import ColorSelectorNode from './ColorSelectorNode';

const onInit = (reactFlowInstance: ReactFlowInstance) => {
  console.log('flow loaded:', reactFlowInstance);
  reactFlowInstance.fitView();
};
const onNodeDragStop = (_: MouseEvent, node: Node) => console.log('drag stop', node);
const onNodeClick = (_: MouseEvent, node: Node) => console.log('click', node);

const initBgColor = '#1A192B';

const connectionLineStyle = { stroke: '#fff' };
const snapGrid: SnapGrid = [16, 16];

const nodeTypes = {
  selectorNode: ColorSelectorNode,
};

const CustomNodeFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [bgColor, setBgColor] = useState<string>(initBgColor);

  useEffect(() => {
    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id !== '2') {
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
      { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#fff' } },
      { id: 'e2a-3', source: '2', sourceHandle: 'a', target: '3', animated: true, style: { stroke: '#fff' } },
      { id: 'e2b-4', source: '2', sourceHandle: 'b', target: '4', animated: true, style: { stroke: '#fff' } },
    ]);
  }, []);

  const onConnect = (connection: Connection) =>
    setEdges((eds) => addEdge({ ...connection, animated: true, style: { stroke: '#fff' } }, eds));

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onNodeClick={onNodeClick}
      onConnect={onConnect}
      onNodeDragStop={onNodeDragStop}
      style={{ background: bgColor }}
      onInit={onInit}
      nodeTypes={nodeTypes}
      connectionLineStyle={connectionLineStyle}
      snapToGrid={true}
      snapGrid={snapGrid}
      defaultZoom={1.5}
      fitView
    >
      <MiniMap
        nodeStrokeColor={(n: Node): string => {
          if (n.type === 'input') return '#0041d0';
          if (n.type === 'selectorNode') return bgColor;
          if (n.type === 'output') return '#ff0072';

          return '#eee';
        }}
        nodeColor={(n: Node): string => {
          if (n.type === 'selectorNode') return bgColor;

          return '#fff';
        }}
      />
      <Controls />
    </ReactFlow>
  );
};

export default CustomNodeFlow;

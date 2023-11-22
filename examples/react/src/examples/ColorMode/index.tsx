import { ChangeEventHandler, FC, useCallback, useState } from 'react';
import {
  ReactFlow,
  addEdge,
  Handle,
  Connection,
  Position,
  Node,
  NodeProps,
  NodeTypes,
  useNodesState,
  useEdgesState,
  OnConnectStart,
  OnConnectEnd,
  OnConnect,
  updateEdge,
  Edge,
  IsValidConnection,
  MiniMap,
  Background,
  Controls,
  Panel,
  ColorMode,
} from '@xyflow/react';

const initialNodes: Node[] = [
  { id: 'A', type: 'input', position: { x: 0, y: 150 }, data: { label: 'A' } },
  { id: 'B', position: { x: 250, y: 0 }, data: { label: 'B' } },
  { id: 'C', position: { x: 250, y: 150 }, data: { label: 'C' } },
  { id: 'D', position: { x: 250, y: 300 }, data: { label: 'D' } },
];

const initialEdges: Edge[] = [
  {
    id: 'A-B',
    source: 'A',
    target: 'B',
  },
  {
    id: 'A-C',
    source: 'A',
    target: 'C',
  },
  {
    id: 'A-D',
    source: 'A',
    target: 'D',
  },
];

const ColorModeFlow = () => {
  const [colorMode, setColorMode] = useState<ColorMode>('light');
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect: OnConnect = useCallback(
    (params) => {
      console.log('on connect', params);
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges]
  );

  const onChange: ChangeEventHandler<HTMLSelectElement> = (evt) => setColorMode(evt.target.value as ColorMode);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      colorMode={colorMode}
      fitView
    >
      <MiniMap />
      <Background />
      <Controls />

      <Panel position="top-right">
        <select onChange={onChange}>
          <option value="light">light</option>
          <option value="dark">dark</option>
          <option value="system">system</option>
        </select>
      </Panel>
    </ReactFlow>
  );
};

export default ColorModeFlow;

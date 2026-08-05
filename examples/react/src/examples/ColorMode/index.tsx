import { ChangeEventHandler, useCallback, useState } from 'react';
import {
  ReactFlow,
  addEdge,
  Node,
  useNodesState,
  useEdgesState,
  OnConnect,
  Edge,
  MiniMap,
  Background,
  Controls,
  Panel,
  ColorMode,
  Position,
} from '@xyflow/react';

const nodeDefaults = {
  sourcePosition: Position.Right,
  targetPosition: Position.Left,
};

const initialNodes: Node[] = [
  { id: 'A', type: 'input', position: { x: 0, y: 150 }, data: { label: 'A' }, ...nodeDefaults },
  { id: 'B', position: { x: 250, y: 0 }, data: { label: 'B' }, ...nodeDefaults },
  { id: 'C', position: { x: 250, y: 150 }, data: { label: 'C' }, ...nodeDefaults },
  { id: 'D', position: { x: 250, y: 300 }, data: { label: 'D' }, ...nodeDefaults },
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

type PageTheme = 'system' | ColorMode;

const ColorModeFlow = () => {
  const [pageTheme, setPageTheme] = useState<PageTheme>('system');
  const [forceColorMode, setForceColorMode] = useState<ColorMode | undefined>(undefined);
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect: OnConnect = useCallback(
    (params) => {
      console.log('on connect', params);
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges]
  );

  const onPageThemeChange: ChangeEventHandler<HTMLSelectElement> = (evt) => {
    const value = evt.target.value as PageTheme;

    setPageTheme(value);

    if (value === 'system') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', value);
    }
  };

  const onForceColorModeChange: ChangeEventHandler<HTMLSelectElement> = (evt) => {
    const value = evt.target.value;

    setForceColorMode(value === 'none' ? undefined : (value as ColorMode));
  };

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      forceColorMode={forceColorMode}
      fitView
    >
      <MiniMap />
      <Background />
      <Controls />

      <Panel position="top-right">
        <label>
          Page theme (html data-theme)
          <select onChange={onPageThemeChange} value={pageTheme} data-testid="colormode-select">
            <option value="system">system</option>
            <option value="light">light</option>
            <option value="dark">dark</option>
          </select>
        </label>
        <label>
          Force color mode (flow only)
          <select onChange={onForceColorModeChange} data-testid="force-colormode-select">
            <option value="none">none</option>
            <option value="light">light</option>
            <option value="dark">dark</option>
          </select>
        </label>
      </Panel>
    </ReactFlow>
  );
};

export default ColorModeFlow;

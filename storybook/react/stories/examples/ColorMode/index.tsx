import { useCallback, useEffect } from 'react';
import {
  ReactFlow,
  addEdge,
  useEdgesState,
  useNodesState,
  type ColorMode,
  type OnConnect,
  Background,
  Controls,
  MiniMap,
  Position,
  type Edge,
} from '@xyflow/react';

const nodeDefaults = {
  sourcePosition: Position.Right,
  targetPosition: Position.Left,
};

const initialNodes = [
  { id: 'A', type: 'input', position: { x: 0, y: 150 }, data: { label: 'A' }, ...nodeDefaults },
  { id: 'B', position: { x: 250, y: 0 }, data: { label: 'B' }, ...nodeDefaults },
  { id: 'C', position: { x: 250, y: 150 }, data: { label: 'C' }, ...nodeDefaults },
  { id: 'D', position: { x: 250, y: 300 }, data: { label: 'D' }, ...nodeDefaults },
];

const initialEdges: Edge[] = [
  { id: 'A-B', source: 'A', target: 'B' },
  { id: 'A-C', source: 'A', target: 'C' },
  { id: 'A-D', source: 'A', target: 'D' },
];

type PageTheme = 'system' | ColorMode;
type ForceColorMode = 'none' | ColorMode;

export type ColorModeExampleProps = {
  pageTheme?: PageTheme;
  forceColorMode?: ForceColorMode;
};

export function ColorModeExample({ pageTheme = 'system', forceColorMode = 'none' }: ColorModeExampleProps) {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect: OnConnect = useCallback(
    (params) => {
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges]
  );

  useEffect(() => {
    if (pageTheme === 'system') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', pageTheme);
    }
  }, [pageTheme]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      forceColorMode={forceColorMode === 'none' ? undefined : forceColorMode}
      fitView
    >
      <MiniMap />
      <Background />
      <Controls />
    </ReactFlow>
  );
}

export default ColorModeExample;

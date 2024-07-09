import { useCallback, useState } from 'react';
import { ReactFlow, addEdge, Node, Connection, Edge, useNodesState, useEdgesState, Panel } from '@xyflow/react';

const initNodes: Node[] = [
  {
    id: '1a',
    type: 'input',
    data: { label: 'Node 1' },
    position: { x: 250, y: 5 },
    className: 'light',
    ariaLabel: 'Input Node 1',
  },
  {
    id: '2a',
    data: { label: 'Node 2' },
    position: { x: 100, y: 100 },
    className: 'light',
    ariaLabel: 'Default Node 2',
  },
  {
    id: '3a',
    data: { label: 'Node 3' },
    position: { x: 400, y: 100 },
    className: 'light',
  },
  {
    id: '4a',
    data: { label: 'Node 4' },
    position: { x: 400, y: 200 },
    className: 'light',
  },
];

const initEdges: Edge[] = [
  { id: 'e1-2', source: '1a', target: '2a', ariaLabel: undefined },
  { id: 'e1-3', source: '1a', target: '3a' },
];

const onPaneClick = () => console.log('pane click');

const BasicFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initEdges);
  const [paneClickDistance, setPaneClickDistance] = useState(0);

  const onConnect = useCallback((params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      paneClickDistance={paneClickDistance}
      onPaneClick={onPaneClick}
    >
      <Panel position="top-right">
        <input
          type="range"
          min={0}
          max={100}
          value={paneClickDistance}
          onChange={(evt) => setPaneClickDistance(+evt.target.value)}
        />
        click distance: {paneClickDistance}
      </Panel>
    </ReactFlow>
  );
};

export default BasicFlow;

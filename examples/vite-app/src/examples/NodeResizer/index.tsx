import { useCallback, useState } from 'react';
import ReactFlow, { Controls, addEdge, Position, Connection, useNodesState, useEdgesState, Panel } from 'reactflow';

import NodeResizerNode from './NodeResizerNode';
import CustomResizer from './CustomResizer';
import CustomResizer2 from './CustomResizer2';

const nodeTypes = {
  resizer: NodeResizerNode,
  customResizer: CustomResizer,
  customResizer2: CustomResizer2,
};

const initialEdges = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
  },
];

const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: { label: 'An input node' },
    position: { x: 0, y: 0 },
    sourcePosition: Position.Right,
  },
  {
    id: '2',
    type: 'resizer',
    data: { label: 'default resizer' },
    position: { x: 250, y: 0 },
    style: {
      width: 200,
      height: 150,
      border: '1px solid #222',
      fontSize: 10,
    },
  },
  {
    id: '3',
    type: 'customResizer',
    data: { label: 'resize control with child component' },
    position: { x: 250, y: 200 },
    style: { border: '1px solid #222', fontSize: 10, width: 100 },
  },
  {
    id: '4',
    type: 'customResizer2',
    data: { label: 'resize controls' },
    position: { x: 100, y: 150 },
    style: { border: '1px solid #222', fontSize: 10 },
  },
  {
    id: '5',
    type: 'customResizer2',
    data: { label: 'min width and height' },
    position: { x: 250, y: 250 },
    style: { border: '1px solid #222', fontSize: 10 },
  },
];

const CustomNodeFlow = () => {
  const [snapToGrid, setSnapToGrid] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge({ ...connection }, eds)),
    [setEdges]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      minZoom={0.2}
      maxZoom={5}
      snapToGrid={snapToGrid}
      fitView
    >
      <Controls />
      <Panel position="bottom-right">
        <button onClick={() => setSnapToGrid(!snapToGrid)}>snapToGrid: {snapToGrid ? 'on' : 'off'}</button>
      </Panel>
    </ReactFlow>
  );
};

export default CustomNodeFlow;

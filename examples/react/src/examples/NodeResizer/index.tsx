import { useCallback, useState } from 'react';
import {
  ReactFlow,
  Controls,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Panel,
  Node,
  Edge,
} from '@xyflow/react';

import DefaultResizer from './DefaultResizer';
import CustomResizer from './CustomResizer';
import VerticalResizer from './VerticalResizer';
import HorizontalResizer from './HorizontalResizer';
import BottomRightResizer from './BottomRightResizer';

const nodeTypes = {
  defaultResizer: DefaultResizer,
  customResizer: CustomResizer,
  verticalResizer: VerticalResizer,
  horizontalResizer: HorizontalResizer,
  bottomRightResizer: BottomRightResizer,
};

const nodeStyle = {
  border: '1px solid #222',
  fontSize: 10,
  backgroundColor: '#ddd',
};

const initialEdges: Edge[] = [];

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'defaultResizer',
    data: { label: 'default resizer' },
    position: { x: 0, y: 0 },
    origin: [1, 1],
    style: { ...nodeStyle },
  },
  {
    id: '1a',
    type: 'defaultResizer',
    data: {
      label: 'default resizer with min and max dimensions',
      minWidth: 100,
      minHeight: 80,
      maxWidth: 200,
      maxHeight: 200,
    },
    position: { x: 0, y: 60 },
    width: 100,
    height: 80,
    style: { ...nodeStyle },
  },
  {
    id: '1b',
    type: 'defaultResizer',
    data: {
      label: 'default resizer with initial size and aspect ratio',
      keepAspectRatio: true,
      minWidth: 100,
      minHeight: 60,
      maxWidth: 400,
      maxHeight: 400,
    },
    position: { x: 250, y: 0 },
    width: 174,
    height: 123,
    style: {
      ...nodeStyle,
    },
  },
  {
    id: '2',
    type: 'customResizer',
    data: { label: 'custom resize icon' },
    position: { x: 0, y: 200 },
    width: 100,
    height: 60,
    style: { ...nodeStyle },
  },
  {
    id: '3',
    type: 'verticalResizer',
    data: { label: 'vertical resizer' },
    position: { x: 250, y: 200 },
    style: { ...nodeStyle },
  },
  {
    id: '3a',
    type: 'verticalResizer',
    data: {
      label: 'vertical resizer with min/maxHeight and aspect ratio',
      minHeight: 50,
      maxHeight: 200,
      keepAspectRatio: true,
    },
    position: { x: 400, y: 200 },
    height: 50,
    style: { ...nodeStyle },
  },
  {
    id: '4',
    type: 'horizontalResizer',
    data: {
      label: 'horizontal resizer with aspect ratio',
      keepAspectRatio: true,
      minHeight: 20,
      maxHeight: 80,
      maxWidth: 300,
    },
    position: { x: 250, y: 300 },
    style: { ...nodeStyle },
  },
  {
    id: '4a',
    type: 'horizontalResizer',
    data: { label: 'horizontal resizer with maxWidth', maxWidth: 300 },
    position: { x: 250, y: 400 },
    style: { ...nodeStyle },
  },
  {
    id: '5',
    type: 'defaultResizer',
    data: { label: 'Parent', keepAspectRatio: true },
    position: { x: 700, y: 0 },
    width: 300,
    height: 300,
    style: { ...nodeStyle },
  },
  {
    id: '5a',
    type: 'defaultResizer',
    data: {
      label: 'Child with extent: parent',
    },
    position: { x: 50, y: 50 },
    parentId: '5',
    extent: 'parent',
    width: 50,
    height: 100,
    style: { ...nodeStyle },
  },
  {
    id: '5b',
    type: 'defaultResizer',
    data: { label: 'Child with expandParent' },
    position: { x: 100, y: 100 },
    width: 100,
    height: 100,
    parentId: '5',
    expandParent: true,
    style: { ...nodeStyle },
  },
  {
    id: '5c',
    type: 'defaultResizer',
    data: { label: 'Child with expandParent & keepAspectRatio' },
    position: { x: 250, y: 200 },
    height: 100,
    width: 100,
    parentId: '5',
    expandParent: true,
    style: { ...nodeStyle },
  },
  {
    id: '6',
    type: 'bottomRightResizer',
    data: { label: 'Bottom Right with horizontal direction' },
    position: { x: 500, y: 500 },
    style: { ...nodeStyle },
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
      onlyRenderVisibleElements
    >
      <Controls />
      <Panel position="bottom-right">
        <button onClick={() => setSnapToGrid((s) => !s)}>snapToGrid: {snapToGrid ? 'on' : 'off'}</button>
      </Panel>
    </ReactFlow>
  );
};

export default CustomNodeFlow;

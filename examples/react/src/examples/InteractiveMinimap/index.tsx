import { MouseEvent, useCallback, useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  Background,
  BackgroundVariant,
  Controls,
  ReactFlowProvider,
  Node,
  Edge,
  useReactFlow,
  XYPosition,
} from '@xyflow/react';

const onNodeDrag = (_: MouseEvent, node: Node) => console.log('drag', node);
const onNodeDragStop = (_: MouseEvent, node: Node) => console.log('drag stop', node);
const onNodeClick = (_: MouseEvent, node: Node) => console.log('click', node);

const initialNodes: Node[] = [
  {
    id: '1',
    data: { label: 'Node 1' },
    position: { x: 0, y: 0 },
  },
  {
    id: '2',
    data: { label: 'Node 2' },
    position: { x: 0, y: 200 },
  },
  {
    id: '3',
    data: { label: 'Node 3' },
    position: { x: 200, y: 0 },
  },

  {
    id: '4',
    data: { label: 'Node 4' },
    position: { x: 1000, y: 0 },
  },
  {
    id: '5',
    data: { label: 'Node 5' },
    position: { x: 1000, y: 200 },
  },
  {
    id: '6',
    data: { label: 'Node 6' },
    position: { x: 800, y: 0 },
  },

  {
    id: '7',
    data: { label: 'Node 4' },
    position: { x: 0, y: 1000 },
  },
  {
    id: '8',
    data: { label: 'Node 5' },
    position: { x: 0, y: 800 },
  },
  {
    id: '9',
    data: { label: 'Node 6' },
    position: { x: 200, y: 1000 },
  },

  {
    id: '10',
    data: { label: 'Node 4' },
    position: { x: 1000, y: 1000 },
  },
  {
    id: '11',
    data: { label: 'Node 5' },
    position: { x: 800, y: 1000 },
  },
  {
    id: '12',
    data: { label: 'Node 6' },
    position: { x: 1000, y: 800 },
  },
];

const initialEdges: Edge[] = [];

const defaultEdgeOptions = { zIndex: 0 };

const BasicFlow = () => {
  const instance = useReactFlow();
  const [inverse, setInverse] = useState(false);

  const updatePos = () => {
    instance.setNodes((nodes) =>
      nodes.map((node) => {
        node.position = {
          x: Math.random() * 400,
          y: Math.random() * 400,
        };

        return node;
      })
    );
  };

  const logToObject = () => console.log(instance.toObject());
  const resetTransform = () => instance.setViewport({ x: 0, y: 0, zoom: 1 });
  const toggleInverse = () => setInverse(!inverse);

  const toggleClassnames = () => {
    instance.setNodes((nodes) =>
      nodes.map((node) => {
        node.className = node.className === 'light' ? 'dark' : 'light';

        return node;
      })
    );
  };

  const onMiniMapClick = useCallback((event: MouseEvent, pos: XYPosition) => {
    console.log(pos);
  }, []);

  const onMiniMapNodeClick = useCallback((event: MouseEvent, node: Node) => {
    console.log(node);
  }, []);

  return (
    <ReactFlow
      defaultNodes={initialNodes}
      defaultEdges={initialEdges}
      onNodeClick={onNodeClick}
      onNodeDragStop={onNodeDragStop}
      onNodeDrag={onNodeDrag}
      className="react-flow-basic-example"
      minZoom={0.2}
      maxZoom={4}
      defaultEdgeOptions={defaultEdgeOptions}
      selectNodesOnDrag={false}
      fitView
    >
      <Background variant={BackgroundVariant.Dots} />
      <MiniMap onClick={onMiniMapClick} onNodeClick={onMiniMapNodeClick} pannable zoomable inversePan={inverse} />
      <Controls />

      <div style={{ position: 'absolute', right: 10, top: 10, zIndex: 4 }}>
        <button onClick={resetTransform} style={{ marginRight: 5 }}>
          reset transform
        </button>
        <button onClick={updatePos} style={{ marginRight: 5 }}>
          change pos
        </button>
        <button onClick={toggleClassnames} style={{ marginRight: 5 }}>
          toggle classnames
        </button>
        <button onClick={logToObject} style={{ marginRight: 5 }}>
          toObject
        </button>
        <button onClick={toggleInverse} style={{ marginRight: 5 }}>
          {inverse ? 'un-inverse pan' : 'inverse pan'}
        </button>
      </div>
    </ReactFlow>
  );
};

export default function App() {
  return (
    <ReactFlowProvider>
      <BasicFlow />
    </ReactFlowProvider>
  );
}

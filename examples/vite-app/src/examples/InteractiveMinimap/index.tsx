import { MouseEvent } from 'react';
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlowProvider,
  Node,
  Edge,
  useReactFlow,
} from 'reactflow';
import { MiniMap } from '@reactflow/interactive-minimap';

const onNodeDrag = (_: MouseEvent, node: Node) => console.log('drag', node);
const onNodeDragStop = (_: MouseEvent, node: Node) => console.log('drag stop', node);
const onNodeClick = (_: MouseEvent, node: Node) => console.log('click', node);

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Node 1' },
    position: { x: 0, y: 0 },
    className: 'light',
  },
  {
    id: '2',
    data: { label: 'Node 2' },
    position: { x: 0, y: 200 },
    className: 'light',
  },
  {
    id: '3',
    data: { label: 'Node 3' },
    position: { x: 200, y: 200 },
    className: 'light',
  },
  {
    id: '4',
    data: { label: 'Node 4' },
    position: { x: 200, y: 400 },
    className: 'light',
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3' },
];

const defaultEdgeOptions = { zIndex: 0 };

const BasicFlow = () => {
  const instance = useReactFlow();

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

  const toggleClassnames = () => {
    instance.setNodes((nodes) =>
      nodes.map((node) => {
        node.className = node.className === 'light' ? 'dark' : 'light';

        return node;
      })
    );
  };

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
      <MiniMap />
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
        <button onClick={logToObject}>toObject</button>
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

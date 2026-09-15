import { useCallback, MouseEvent } from 'react';
import {
  ReactFlow,
  MiniMap,
  Background,
  Controls,
  ReactFlowProvider,
  Node,
  Edge,
  useReactFlow,
  useNodesState,
} from '@xyflow/react';

import './style.css';

const onNodeDragStop = (_: MouseEvent, node: Node) => console.log('drag stop', node);
const onNodeClick = (_: MouseEvent, node: Node) => console.log('click', node);

const initialNodes: Node[] = [
  {
    id: '0',
    data: { label: 'rectangle' },
    position: { x: 0, y: 0 },
    width: 100,
    height: 100,
    draggable: false,
    style: {
      opacity: 0.5,
    },
  },
  {
    id: '1',
    type: 'input',
    data: { label: 'Node 1' },
    position: { x: 0, y: 0 },
    width: 200,
    height: 100,
  },
  {
    id: '2',
    data: { label: 'Node 2' },
    position: { x: 0, y: 150 },
  },
  {
    id: '3',
    data: { label: 'Node 3' },
    position: { x: 250, y: 0 },
  },
  {
    id: '4',
    data: { label: 'Node' },
    position: { x: 350, y: 150 },
    style: {
      width: 50,
      height: 50,
    },
  },
];

const initialEdges: Edge[] = [];

const defaultEdgeOptions = { zIndex: 0 };

const BasicFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const { getIntersectingNodes, isNodeIntersecting } = useReactFlow();

  const onNodeDrag = useCallback((_: MouseEvent, node: Node) => {
    const intersections = getIntersectingNodes(node).map((n) => n.id);
    const isIntersecting = isNodeIntersecting(node, { x: 0, y: 0, width: 100, height: 100 });

    console.log(isIntersecting);

    setNodes((ns) =>
      ns.map((n) => ({
        ...n,
        className: intersections.includes(n.id) ? 'highlight' : '',
      }))
    );
  }, []);

  return (
    <ReactFlow
      nodes={nodes}
      edges={initialEdges}
      onNodesChange={onNodesChange}
      onNodeClick={onNodeClick}
      onNodeDragStop={onNodeDragStop}
      onNodeDrag={onNodeDrag}
      className="react-flow-basic-example"
      minZoom={0.2}
      maxZoom={4}
      fitView
      defaultEdgeOptions={defaultEdgeOptions}
      selectNodesOnDrag={false}
    >
      <Background />
      <MiniMap />
      <Controls />
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

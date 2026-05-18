import {
  ReactFlow,
  Node,
  Edge,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  EdgeProps,
  getBezierPath,
} from '@xyflow/react';

const initialNodes: Node[] = [
  {
    id: '1',
    data: { label: 'Node 1' },
    position: { x: 250, y: 5 },
    className: 'light',
  },
  {
    id: '2',
    data: { label: 'Node 2' },
    position: { x: 100, y: 100 },
    className: 'light',
  },
];

const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    type: 'unregistered', // This will fallback to custom default
  },
];

const CustomEdge = ({ sourceX, sourceY, targetX, targetY }: EdgeProps) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <>
      <path d={edgePath} stroke="red" strokeWidth={3} fill="none" strokeDasharray="5,5" />
    </>
  );
};

const edgeTypes = {
  default: CustomEdge,
};

const DefaultEdgeOverwrite = () => {
  return (
    <ReactFlow defaultNodes={initialNodes} defaultEdges={initialEdges} edgeTypes={edgeTypes} fitView>
      <Background variant={BackgroundVariant.Lines} />
    </ReactFlow>
  );
};

export default function App() {
  return (
    <ReactFlowProvider>
      <DefaultEdgeOverwrite />
    </ReactFlowProvider>
  );
}

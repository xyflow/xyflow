import {
  ReactFlow,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  getIncomers,
  getOutgoers,
  getConnectedEdges,
  BackgroundVariant,
  ReactFlowProvider,
  Node,
  MarkerType,
  Edge,
} from '@xyflow/solidjs';

import '@xyflow/solidjs/dist/style.css';
import { batch, createEffect } from 'solid-js';
import { untrack } from 'solid-js/web';

const initialNodes = [
  { id: '1', type: 'input', data: { label: '1' }, position: { x: -150, y: 0 } },
  { id: '2', type: 'input', data: { label: '2' }, position: { x: 150, y: 0 } },
  { id: '3', data: { label: '3' }, position: { x: 0, y: 100 } },
  { id: '4', data: { label: '4' }, position: { x: 0, y: 200 } },
  { id: '5', type: 'output', data: { label: '5' }, position: { x: 0, y: 300 } },
];

const initialEdges = [
  {
    id: '1->3',
    source: '1',
    target: '3',
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
    markerStart: {
      type: MarkerType.ArrowClosed,
      orient: 'auto-start-reverse',
    },
  },
  {
    id: '2->3',
    source: '2',
    target: '3',
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: '#FF0072',
    },
    label: 'marker size and color',
    style: {
      'stroke-width': '2px',
      stroke: '#FF0072',
    },
  },
  { id: '3->4', source: '3', target: '4' },
  { id: '4->5', source: '4', target: '5' },
] satisfies Edge[];

export default function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = (params: any) => setEdges(addEdge(params, edges()));
  const onNodesDelete = (deleted: Node[]) => {
    // batch(() => {
    setEdges(
      deleted.reduce((acc, node) => {
        console.log('node', node);
        console.log('nodes', nodes());
        console.log('edges', edges());
        const incomers = getIncomers(node, nodes(), edges());
        const outgoers = getOutgoers(node, nodes(), edges());
        console.log('incomers', incomers);
        console.log('outgoers', outgoers);

        const connectedEdges = getConnectedEdges([node], edges());

        const remainingEdges = acc.filter((edge) => !connectedEdges.includes(edge));

        const createdEdges = incomers.flatMap(({ id: source }) =>
          outgoers.map(({ id: target }) => ({ id: `${source}->${target}`, source, target }))
        );

        console.log('createdEdges', createdEdges);

        return [...remainingEdges, ...createdEdges];
      }, edges())
    );
    // });
  };

  createEffect(() => {
    console.log('edges', edges());
  });

  return (
    <ReactFlowProvider>
      <div
        style={{
          width: '100%',
          height: '100vh',
        }}
      >
        <ReactFlow
          nodes={nodes()}
          edges={edges()}
          onNodesChange={onNodesChange}
          onNodesDelete={onNodesDelete}
          onEdgesChange={(...props) => {
            console.log('onEdgesChange', props);
            onEdgesChange(...props);
          }}
          onConnect={onConnect}
          fitView
          attributionPosition="top-right"
        >
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
}

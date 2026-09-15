import {
  ReactFlow,
  ReactFlowProvider,
  Controls,
  Background,
  Panel,
  useNodesState,
  useEdgesState,
  useReactFlow,
  addEdge,
  MarkerType,
  type Node,
  type Edge,
} from '@xyflow/react';
import initialFlow from './config';
import { layoutNodes } from './layout';
import InteractionPanel from '../../../InteractionPanel/InteractionPanel';
function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(
    layoutNodes(structuredClone(initialFlow.nodes), initialFlow.edges, 'TB') as Node[]
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(structuredClone(initialFlow.edges) as Edge[]);
  const { fitView } = useReactFlow();
  const layout = (direction: 'TB' | 'LR') => setNodes((nodes) => layoutNodes(nodes, edges, direction) as Node[]);
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={(connection) => setEdges((edges) => addEdge(connection, edges))}
      fitView
    >
      <Background />
      <Controls />
      <InteractionPanel />
      <Panel position="top-left">
        <button onClick={() => layout('TB')}>vertical layout</button>
        <button onClick={() => layout('LR')}>horizontal layout</button>
        <button onClick={() => setNodes((nodes) => nodes.map((node) => ({ ...node, selected: false })))}>
          unselect nodes
        </button>
        <button
          onClick={() =>
            setEdges((edges) =>
              edges.map((edge) => ({
                ...edge,
                markerEnd: {
                  type:
                    typeof edge.markerEnd === 'object' && edge.markerEnd.type === MarkerType.Arrow
                      ? MarkerType.ArrowClosed
                      : MarkerType.Arrow,
                },
              }))
            )
          }
        >
          change marker
        </button>
        <button onClick={() => fitView()}>fitView</button>
        <button onClick={() => fitView({ nodes: nodes.slice(0, 2) })}>fitView partially</button>
      </Panel>
    </ReactFlow>
  );
}
export default function Example() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}

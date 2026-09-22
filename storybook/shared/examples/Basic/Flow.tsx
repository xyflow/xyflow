import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  SelectionMode,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  type Node,
  type Edge,
} from '@xyflow/react';
import { action } from 'storybook/actions';
import { defaultFlowProps } from '../../defaultFlow';
import { figmaFlowProps, type BasicArgs } from './config';
import InteractionPanel from '../../InteractionPanel/InteractionPanel';

function Flow({ controlled = false, isHidden = false, figma = false }: BasicArgs & { controlled?: boolean }) {
  const [nodes, , onNodesChange] = useNodesState<Node>(structuredClone(defaultFlowProps.nodes));
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(structuredClone(defaultFlowProps.edges));
  return (
    <ReactFlow<Node, Edge>
      {...defaultFlowProps}
      {...(figma ? figmaFlowProps : {})}
      selectionMode={figma ? SelectionMode.Partial : SelectionMode.Full}
      multiSelectionKeyCode={figma ? ['Meta', 'Shift'] : undefined}
      onPaneContextMenu={figma ? (event) => event.preventDefault() : undefined}
      {...(controlled
        ? { nodes, edges }
        : {
            nodes: undefined,
            edges: undefined,
            defaultNodes: defaultFlowProps.nodes,
            defaultEdges: defaultFlowProps.edges,
          })}
      onNodesChange={(changes) => {
        if (controlled) onNodesChange(changes);
        action('onNodesChange')(changes);
      }}
      onEdgesChange={(changes) => {
        if (controlled) onEdgesChange(changes);
        action('onEdgesChange')(changes);
      }}
      onConnect={controlled ? (connection) => setEdges((current) => addEdge(connection, current)) : undefined}
      style={{ display: isHidden ? 'none' : 'block' }}
    >
      <Background />
      <Controls />
      <MiniMap />
      <InteractionPanel />
    </ReactFlow>
  );
}
export default function Basic(props: BasicArgs & { controlled?: boolean }) {
  return (
    <ReactFlowProvider key={String(props.controlled)}>
      <Flow {...props} />
    </ReactFlowProvider>
  );
}

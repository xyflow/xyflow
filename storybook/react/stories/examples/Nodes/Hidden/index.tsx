import { defaultFlowProps } from '@shared/defaultFlow';
import { useCallback, useEffect } from 'react';
import {
  ReactFlow,
  addEdge,
  Node,
  Connection,
  Edge,
  useNodesState,
  useEdgesState,
  MiniMap,
  Controls,
} from '@xyflow/react';
import InteractionPanel from '@shared/InteractionPanel/InteractionPanel';

const initialNodes = defaultFlowProps.nodes;
const initialEdges = defaultFlowProps.edges;

const setHidden =
  (hidden: boolean) =>
  <T extends { hidden?: boolean }>(elements: T[]) =>
    elements.map((element) => ({ ...element, hidden }));

export type HiddenExampleProps = {
  isHidden?: boolean;
};

export function HiddenExample({ isHidden = true }: HiddenExampleProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(initialEdges);

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge(connection, eds));
    },
    [setEdges]
  );

  useEffect(() => {
    setNodes(setHidden(isHidden));
    setEdges(setHidden(isHidden));
  }, [isHidden, setEdges, setNodes]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onConnect={onConnect}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
    >
      <MiniMap />
      <Controls />
      <InteractionPanel />
    </ReactFlow>
  );
}

export default HiddenExample;

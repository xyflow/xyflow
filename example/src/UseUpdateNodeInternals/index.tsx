import { useCallback, CSSProperties } from 'react';

import ReactFlow, {
  NodeTypes,
  addEdge,
  useReactFlow,
  ReactFlowProvider,
  Node,
  Connection,
  Edge,
  useUpdateNodeInternals,
  Position,
  useNodesState,
  useEdgesState,
} from 'react-flow-renderer';
import CustomNode from './CustomNode';

const initialHandleCount = 1;

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'custom',
    data: { label: 'Node 1', handleCount: initialHandleCount, handlePosition: 0 },
    position: { x: 250, y: 5 },
  },
];

const buttonWrapperStyles: CSSProperties = { position: 'absolute', right: 10, top: 10, zIndex: 10 };

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

let id = 5;
const getId = (): string => `${id++}`;

const UpdateNodeInternalsFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const onConnect = (params: Edge | Connection) => setEdges((els) => addEdge(params, els));

  const updateNodeInternals = useUpdateNodeInternals();
  const { project } = useReactFlow();

  const onPaneClick = useCallback(
    (evt) =>
      setNodes((nds) =>
        nds.concat({
          id: getId(),
          position: project({ x: evt.clientX, y: evt.clientY - 40 }),
          data: { label: 'new node' },
          targetPosition: Position.Left,
          sourcePosition: Position.Right,
        })
      ),
    [project]
  );

  const toggleHandleCount = useCallback(() => {
    setNodes((nds) =>
      nds.map((node) => {
        return { ...node, data: { ...node.data, handleCount: node.data?.handleCount === 1 ? 2 : 1 } };
      })
    );
  }, []);

  const toggleHandlePosition = useCallback(() => {
    setNodes((nds) =>
      nds.map((node) => {
        return { ...node, data: { ...node.data, handlePosition: node.data?.handlePosition === 0 ? 1 : 0 } };
      })
    );
  }, []);

  const updateNode = useCallback(() => updateNodeInternals('1'), [updateNodeInternals]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      onConnect={onConnect}
      onPaneClick={onPaneClick}
    >
      <div style={buttonWrapperStyles}>
        <button onClick={toggleHandleCount}>toggle handle count</button>
        <button onClick={toggleHandlePosition}>toggle handle position</button>
        <button onClick={updateNode}>update node internals</button>
      </div>
    </ReactFlow>
  );
};

const WrappedFlow = () => (
  <ReactFlowProvider>
    <UpdateNodeInternalsFlow />
  </ReactFlowProvider>
);

export default WrappedFlow;

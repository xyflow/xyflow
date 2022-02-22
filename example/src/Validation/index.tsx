import { MouseEvent as ReactMouseEvent, FC } from 'react';
import ReactFlow, {
  addEdge,
  Handle,
  Connection,
  Position,
  Node,
  Edge,
  OnConnectStartParams,
  NodeProps,
  NodeTypes,
  useNodesState,
  useEdgesState,
} from 'react-flow-renderer';

import './validation.css';

const initialNodes: Node[] = [
  { id: '0', type: 'custominput', position: { x: 0, y: 150 }, data: null },
  { id: 'A', type: 'customnode', position: { x: 250, y: 0 }, data: null },
  { id: 'B', type: 'customnode', position: { x: 250, y: 150 }, data: null },
  { id: 'C', type: 'customnode', position: { x: 250, y: 300 }, data: null },
];

const isValidConnection = (connection: Connection) => connection.target === 'B';
const onConnectStart = (_: ReactMouseEvent, { nodeId, handleType }: OnConnectStartParams) =>
  console.log('on connect start', { nodeId, handleType });
const onConnectStop = (event: MouseEvent) => console.log('on connect stop', event);
const onConnectEnd = (event: MouseEvent) => console.log('on connect end', event);

const CustomInput: FC<NodeProps> = () => (
  <>
    <div>Only connectable with B</div>
    <Handle type="source" position={Position.Right} isValidConnection={isValidConnection} />
  </>
);

const CustomNode: FC<NodeProps> = ({ id }) => (
  <>
    <Handle type="target" position={Position.Left} isValidConnection={isValidConnection} />
    <div>{id}</div>
    <Handle type="source" position={Position.Right} isValidConnection={isValidConnection} />
  </>
);

const nodeTypes: NodeTypes = {
  custominput: CustomInput,
  customnode: CustomNode,
};

const ValidationFlow = () => {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = (params: Connection | Edge) => {
    console.log('on connect', params);
    setEdges((eds) => addEdge(params, eds));
  };

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      selectNodesOnDrag={false}
      className="validationflow"
      nodeTypes={nodeTypes}
      onConnectStart={onConnectStart}
      onConnectStop={onConnectStop}
      onConnectEnd={onConnectEnd}
      fitView
    />
  );
};

export default ValidationFlow;

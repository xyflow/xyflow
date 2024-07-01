import { FC, useCallback, useState } from 'react';
import {
  ReactFlow,
  addEdge,
  Handle,
  Connection,
  Position,
  Node,
  NodeProps,
  NodeTypes,
  useNodesState,
  useEdgesState,
  OnConnectStart,
  OnConnectEnd,
  OnConnect,
  reconnectEdge,
  Edge,
  IsValidConnection,
  OnBeforeDelete,
} from '@xyflow/react';

import ConnectionStatus from './ConnectionStatus';

import styles from './validation.module.css';

const initialNodes: Node[] = [
  { id: '0', type: 'custominput', position: { x: 0, y: 150 }, data: {} },
  { id: 'A', type: 'customnode', position: { x: 250, y: 0 }, data: {} },
  { id: 'B', type: 'customnode', position: { x: 250, y: 150 }, data: {} },
  { id: 'C', type: 'customnode', position: { x: 250, y: 300 }, data: {} },
];

const isValidConnection: IsValidConnection = (connection) => connection.target === 'B';

const CustomInput: FC<NodeProps> = () => (
  <>
    <div>Only connectable with B</div>
    <Handle type="source" position={Position.Right} />
  </>
);

const CustomNode: FC<NodeProps> = ({ id }) => (
  <>
    <Handle type="target" position={Position.Top} isConnectableStart={false} />
    <div>{id}</div>
    <Handle type="source" position={Position.Right} />
  </>
);

const nodeTypes: NodeTypes = {
  custominput: CustomInput,
  customnode: CustomNode,
};

const ValidationFlow = () => {
  const [value, setValue] = useState(0);
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const onConnectStart: OnConnectStart = useCallback(
    (event, params) => {
      console.log('on connect start', params, event, value);
      setValue(1);
    },
    [value]
  );

  const onConnect: OnConnect = useCallback(
    (params) => {
      console.log('on connect', params);
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges]
  );

  const onConnectEnd: OnConnectEnd = useCallback(
    (event) => {
      console.log('on connect end', event, value);
      setValue(0);
    },
    [value]
  );

  const onReconnect = useCallback(
    (oldEdge: Edge, newConnection: Connection) => setEdges((els) => reconnectEdge(oldEdge, newConnection, els)),
    [setEdges]
  );

  const onBeforeDelete: OnBeforeDelete = useCallback(async () => {
    return true;
  }, []);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      selectNodesOnDrag={false}
      className={styles.validationflow}
      nodeTypes={nodeTypes}
      onConnectStart={onConnectStart}
      onConnectEnd={onConnectEnd}
      onReconnect={onReconnect}
      isValidConnection={isValidConnection}
      onBeforeDelete={onBeforeDelete}
      fitView
    >
      <ConnectionStatus />
    </ReactFlow>
  );
};

export default ValidationFlow;

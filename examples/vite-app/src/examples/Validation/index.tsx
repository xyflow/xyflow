import React, { FC, useCallback, useState } from 'react';
import ReactFlow, {
  addEdge,
  Handle,
  Connection,
  Position,
  Node,
  Edge,
  NodeProps,
  NodeTypes,
  useNodesState,
  useEdgesState,
  OnConnectStartParams,
} from 'reactflow';

import styles from './validation.module.css';

const initialNodes: Node[] = [
  { id: '0', type: 'custominput', position: { x: 0, y: 150 }, data: null },
  { id: 'A', type: 'customnode', position: { x: 250, y: 0 }, data: null },
  { id: 'B', type: 'customnode', position: { x: 250, y: 150 }, data: null },
  { id: 'C', type: 'customnode', position: { x: 250, y: 300 }, data: null },
];

const isValidConnection = (connection: Connection) => connection.target === 'B';

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
  const [value, setValue] = useState(0);
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnectStart = useCallback(
    (event: React.MouseEvent, params: OnConnectStartParams) => {
      console.log('on connect start', params, event, value);
      setValue(1);
    },
    [value]
  );

  const onConnect = useCallback(
    (params: Connection | Edge) => {
      console.log('on connect', params);
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges]
  );

  const onConnectEnd = useCallback(
    (event: MouseEvent) => {
      console.log('on connect end', event, value);
      setValue(0);
    },
    [value]
  );

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
      fitView
    />
  );
};

export default ValidationFlow;

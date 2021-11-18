import React, { useState, MouseEvent as ReactMouseEvent, FC } from 'react';
import ReactFlow, {
  addEdge,
  Handle,
  OnLoadParams,
  Connection,
  Position,
  Elements,
  Edge,
  OnConnectStartParams,
  NodeProps,
  NodeTypesType,
} from 'react-flow-renderer';

import './validation.css';

const initialElements: Elements = [
  { id: '0', type: 'custominput', position: { x: 0, y: 150 } },
  { id: 'A', type: 'customnode', position: { x: 250, y: 0 } },
  { id: 'B', type: 'customnode', position: { x: 250, y: 150 } },
  { id: 'C', type: 'customnode', position: { x: 250, y: 300 } },
];

const onLoad = (reactFlowInstance: OnLoadParams) => reactFlowInstance.fitView();
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

const nodeTypes: NodeTypesType = {
  custominput: CustomInput,
  customnode: CustomNode,
};

const HorizontalFlow = () => {
  const [elements, setElements] = useState<Elements>(initialElements);
  const onConnect = (params: Connection | Edge) => {
    console.log('on connect', params);
    setElements((els) => addEdge(params, els));
  };

  return (
    <ReactFlow
      elements={elements}
      onConnect={onConnect}
      selectNodesOnDrag={false}
      onLoad={onLoad}
      className="validationflow"
      nodeTypes={nodeTypes}
      onConnectStart={onConnectStart}
      onConnectStop={onConnectStop}
      onConnectEnd={onConnectEnd}
    />
  );
};

export default HorizontalFlow;

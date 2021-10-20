import React, { useState, CSSProperties, FC } from 'react';

import ReactFlow, {
  addEdge,
  Elements,
  Position,
  Connection,
  Edge,
  NodeProps,
  NodeTypesType,
} from 'react-flow-renderer';

const initialElements: Elements = [
  {
    id: '1',
    sourcePosition: Position.Right,
    type: 'input',
    data: { label: 'Input' },
    position: { x: 0, y: 80 },
  },
  {
    id: '2',
    type: 'a',
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    data: { label: 'A Node' },
    position: { x: 250, y: 0 },
  },
];

const buttonStyle: CSSProperties = { position: 'absolute', right: 10, top: 30, zIndex: 4 };

const nodeStyles: CSSProperties = { padding: '10px 15px', border: '1px solid #ddd' };

const NodeA: FC<NodeProps> = () => {
  return <div style={nodeStyles}>A</div>;
};

const NodeB: FC<NodeProps> = () => {
  return <div style={nodeStyles}>B</div>;
};

type NodeTypesObject = {
  [key: string]: NodeTypesType;
};

const nodeTypesObjects: NodeTypesObject = {
  a: {
    a: NodeA,
  },
  b: {
    b: NodeB,
  },
};

const NodeTypeChangeFlow = () => {
  const [nodeTypesId, setNodeTypesId] = useState<string>('a');
  const [elements, setElements] = useState<Elements>(initialElements);
  const onConnect = (params: Connection | Edge) => setElements((els) => addEdge(params, els));
  const changeType = () => setNodeTypesId((nt) => (nt === 'a' ? 'b' : 'a'));

  return (
    <ReactFlow
      elements={elements}
      onConnect={onConnect}
      nodeTypes={nodeTypesObjects[nodeTypesId]}
      nodeTypesId={nodeTypesId}
    >
      <button onClick={changeType} style={buttonStyle}>
        change type
      </button>
    </ReactFlow>
  );
};

export default NodeTypeChangeFlow;

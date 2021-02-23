import React, { useState, CSSProperties } from 'react';

import ReactFlow, { addEdge, isEdge, OnLoadParams, Elements, Position, Connection, Edge } from 'react-flow-renderer';

const onLoad = (reactFlowInstance: OnLoadParams) => reactFlowInstance.fitView();

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
    type: 'output',
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    data: { label: 'A Node' },
    position: { x: 250, y: 0 },
  },
  { id: 'e1-2', source: '1', type: 'smoothstep', target: '2', animated: true },
];

const buttonStyle: CSSProperties = { position: 'absolute', right: 10, top: 30, zIndex: 4 };

const NodeTypeChangeFlow = () => {
  const [elements, setElements] = useState<Elements>(initialElements);
  const onConnect = (params: Connection | Edge) => setElements((els) => addEdge(params, els));
  const changeType = () => {
    setElements((elms) =>
      elms.map((el) => {
        if (isEdge(el) || el.type === 'input') {
          return el;
        }

        return {
          ...el,
          type: el.type === 'default' ? 'output' : 'default',
        };
      })
    );
  };

  return (
    <ReactFlow elements={elements} onConnect={onConnect} onLoad={onLoad}>
      <button onClick={changeType} style={buttonStyle}>
        change type
      </button>
    </ReactFlow>
  );
};

export default NodeTypeChangeFlow;

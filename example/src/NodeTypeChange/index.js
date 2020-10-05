import React, { useState } from 'react';

import ReactFlow, { addEdge } from 'react-flow-renderer';

const onLoad = (reactFlowInstance) => reactFlowInstance.fitView();

const initialElements = [
  {
    id: '1',
    sourcePosition: 'right',
    type: 'input',
    data: { label: 'Input' },
    position: { x: 0, y: 80 },
  },
  {
    id: '2',
    type: 'output',
    sourcePosition: 'right',
    targetPosition: 'left',
    data: { label: 'A Node' },
    position: { x: 250, y: 0 },
  },
  { id: 'e1-2', source: '1', type: 'smoothstep', target: '2', animated: true },
];

const HorizontalFlow = () => {
  const [elements, setElements] = useState(initialElements);
  const onConnect = (params) => setElements((els) => addEdge(params, els));
  const changeType = () => {
    setElements((elms) =>
      elms.map((el) => {
        if (el.type === 'input') {
          return el;
        }

        el.type = el.type === 'default' ? 'output' : 'default';

        return { ...el };
      })
    );
  };

  return (
    <ReactFlow elements={elements} onConnect={onConnect} onLoad={onLoad}>
      <button onClick={changeType} style={{ position: 'absolute', right: 10, top: 30, zIndex: 4 }}>
        change type
      </button>
    </ReactFlow>
  );
};

export default HorizontalFlow;

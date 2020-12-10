import React, { useEffect, useState } from 'react';

import ReactFlow from 'react-flow-renderer';

const initialElements = [
  { id: '1', data: { label: '-' }, position: { x: 100, y: 100 } },
  { id: '2', data: { label: 'Node 2' }, position: { x: 100, y: 200 } },
  { id: 'e1-2', source: '1', target: '2' },
];

const BasicFlow = () => {
  const [elements, setElements] = useState(initialElements);
  const [nodeName, setNodeName] = useState('Node 1');

  useEffect(() => {
    setElements((els) =>
      els.map((el) => {
        if (el.id === '1') {
          return {
            ...el,
            data: {
              ...el.data,
              label: nodeName,
            },
          };
        }

        return el;
      })
    );
  }, [nodeName, setElements]);

  return (
    <ReactFlow elements={elements} defaultZoom={1.5} minZoom={0.2} maxZoom={4}>
      <div style={{ position: 'absolute', right: 10, top: 10, zIndex: 4 }}>
        <input value={nodeName} onChange={(evt) => setNodeName(evt.target.value)} />
      </div>
    </ReactFlow>
  );
};

export default BasicFlow;

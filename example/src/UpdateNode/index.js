import React, { useEffect, useState } from 'react';

import ReactFlow from 'react-flow-renderer';

const initialElements = [
  { id: '1', data: { label: '-' }, position: { x: 100, y: 100 } },
  { id: '2', data: { label: 'Node 2' }, position: { x: 100, y: 200 } },
  { id: 'e1-2', source: '1', target: '2' },
];

const UpdateNode = () => {
  const [elements, setElements] = useState(initialElements);
  const [nodeName, setNodeName] = useState('Node 1');
  const [nodeBg, setNodeBg] = useState('#eee');

  useEffect(() => {
    setElements((els) =>
      els.map((el) => {
        if (el.id === '1') {
          // it's important that you create a new object here in order to notify react flow about the change
          el.data = {
            ...el.data,
            label: nodeName,
          };
        }

        return el;
      })
    );
  }, [nodeName, setElements]);

  useEffect(() => {
    setElements((els) =>
      els.map((el) => {
        if (el.id === '1') {
          // it's important that you create a new object here in order to notify react flow about the change
          el.style = { ...el.style, backgroundColor: nodeBg };
        }

        return el;
      })
    );
  }, [nodeBg, setElements]);

  return (
    <ReactFlow elements={elements} defaultZoom={1.5} minZoom={0.2} maxZoom={4}>
      <div style={{ position: 'absolute', right: 10, top: 10, zIndex: 4, fontSize: 12 }}>
        <label style={{ display: 'block' }}>label:</label>
        <input value={nodeName} onChange={(evt) => setNodeName(evt.target.value)} />

        <label style={{ display: 'block', marginTop: 10 }}>background:</label>
        <input value={nodeBg} onChange={(evt) => setNodeBg(evt.target.value)} />
      </div>
    </ReactFlow>
  );
};

export default UpdateNode;

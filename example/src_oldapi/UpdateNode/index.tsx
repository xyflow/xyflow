import React, { useEffect, useState } from 'react';
import ReactFlow, { Elements } from 'react-flow-renderer';

import './updatenode.css';

const initialElements: Elements = [
  { id: '1', data: { label: '-' }, position: { x: 100, y: 100 } },
  { id: '2', data: { label: 'Node 2' }, position: { x: 100, y: 200 } },
  { id: 'e1-2', source: '1', target: '2' },
];

const UpdateNode = () => {
  const [elements, setElements] = useState<Elements>(initialElements);
  const [nodeName, setNodeName] = useState<string>('Node 1');
  const [nodeBg, setNodeBg] = useState<string>('#eee');
  const [nodeHidden, setNodeHidden] = useState<boolean>(false);

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

  useEffect(() => {
    setElements((els) =>
      els.map((el) => {
        if (el.id === '1' || el.id === 'e1-2') {
          // when you update a simple type you can just update the value
          el.isHidden = nodeHidden;
        }

        return el;
      })
    );
  }, [nodeHidden, setElements]);

  return (
    <ReactFlow elements={elements} defaultZoom={1.5} minZoom={0.2} maxZoom={4}>
      <div className="updatenode__controls">
        <label>label:</label>
        <input value={nodeName} onChange={(evt) => setNodeName(evt.target.value)} />

        <label className="updatenode__bglabel">background:</label>
        <input value={nodeBg} onChange={(evt) => setNodeBg(evt.target.value)} />

        <div className="updatenode__checkboxwrapper">
          <label>hidden:</label>
          <input type="checkbox" checked={nodeHidden} onChange={(evt) => setNodeHidden(evt.target.checked)} />
        </div>
      </div>
    </ReactFlow>
  );
};

export default UpdateNode;

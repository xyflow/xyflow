import React, { useState } from 'react';

import ReactFlow, { MiniMap, Controls } from 'react-flow-renderer';

const initialElements = [
  { id: '1', type: 'input', data: { label: 'Node 1' }, position: { x: 250, y: 5 } },
  { id: '2', data: { label: 'Node 2' }, position: { x: 100, y: 100 } },
  { id: '3', data: { label: 'Node 3' }, position: { x: 400, y: 100 } },
  { id: '4', data: { label: 'Node 4' }, position: { x: 400, y: 200 } },
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3' },
];

const EmptyGraph = () => {
  const [isInteractive, setIsInteractive] = useState(false);
  const onToggleInteractive = (evt) => {
    setIsInteractive(evt.target.checked);
  };

  return (
    <ReactFlow
      elements={initialElements}
      style={{ width: '100%', height: '100%' }}
      backgroundType="lines"
      isInteractive={isInteractive}
    >
      <MiniMap />
      <Controls />
      <div
        style={{ position: 'absolute', left: 10, top: 10, zIndex: 4 }}
      >
        <label>
          interactive
          <input
            type="checkbox"
            checked={isInteractive}
            onChange={onToggleInteractive}
            className="react-flow__interactive"
          />
        </label>
      </div>
    </ReactFlow>
  );
}

export default EmptyGraph;

import React, { useState } from 'react';

import ReactFlow, { addEdge, MiniMap, Controls } from 'react-flow-renderer';
import { useEffect } from 'react';

const initialElements = [
  {
    id: 'hidden-1',
    type: 'input',
    data: { label: 'Node 1' },
    position: { x: 250, y: 5 },
  },
  { id: 'hidden-2', data: { label: 'Node 2' }, position: { x: 100, y: 100 } },
  { id: 'hidden-3', data: { label: 'Node 3' }, position: { x: 400, y: 100 } },
  { id: 'hidden-4', data: { label: 'Node 4' }, position: { x: 400, y: 200 } },
  { id: 'hidden-e1-2', source: 'hidden-1', target: 'hidden-2' },
  { id: 'hidden-e1-3', source: 'hidden-1', target: 'hidden-3' },
  { id: 'hidden-e3-4', source: 'hidden-3', target: 'hidden-4' },
];

const HiddenFlow = () => {
  const [elements, setElements] = useState(initialElements);
  const [isHidden, setIsHidden] = useState(false);
  const onConnect = (params) => setElements((els) => addEdge(params, els));

  useEffect(() => {
    setElements((els) =>
      els.map((e) => {
        e.isHidden = isHidden;
        return e;
      })
    );
  }, [isHidden]);

  return (
    <ReactFlow elements={elements} onConnect={onConnect}>
      <MiniMap />
      <Controls />

      <div style={{ position: 'absolute', left: 10, top: 10, zIndex: 4 }}>
        <div>
          <label htmlFor="ishidden">
            isHidden
            <input
              id="ishidden"
              type="checkbox"
              checked={isHidden}
              onChange={(event) => setIsHidden(event.target.checked)}
              className="react-flow__ishidden"
            />
          </label>
        </div>
      </div>
    </ReactFlow>
  );
};

export default HiddenFlow;

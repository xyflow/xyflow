import React, { useState } from 'react';

import ReactFlow, { removeElements, addEdge, MiniMap, isNode, Controls, Background } from 'react-flow-renderer';
import { getElements } from './utils';

const onLoad = (reactFlowInstance) => {
  reactFlowInstance.fitView();
  console.log(reactFlowInstance.getElements());
};

const initialElements = getElements(10, 10);

const StressFlow = () => {
  const [elements, setElements] = useState(initialElements);
  const onElementsRemove = (elementsToRemove) => setElements((els) => removeElements(elementsToRemove, els));
  const onConnect = (params) => setElements((els) => addEdge(params, els));

  const updatePos = () => {
    setElements((elms) => {
      return elms.map((el) => {
        if (isNode(el)) {
          return {
            ...el,
            position: {
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            },
          };
        }

        return el;
      });
    });
  };

  const updateElements = () => {
    const grid = Math.ceil(Math.random() * 10);
    setElements(getElements(grid, grid));
  };

  return (
    <ReactFlow elements={elements} onLoad={onLoad} onElementsRemove={onElementsRemove} onConnect={onConnect}>
      <MiniMap />
      <Controls />
      <Background />

      <div style={{ position: 'absolute', right: 10, top: 10, zIndex: 4 }}>
        <button onClick={updatePos} style={{ marginRight: 5 }}>
          change pos
        </button>
        <button onClick={updateElements}>update elements</button>
      </div>
    </ReactFlow>
  );
};

export default StressFlow;

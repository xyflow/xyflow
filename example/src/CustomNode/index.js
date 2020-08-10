import React, { useState, useEffect } from 'react';

import ReactFlow, { isEdge, removeElements, addEdge, MiniMap, Controls } from 'react-flow-renderer';

import ColorSelectorNode from './ColorSelectorNode';

const onLoad = (reactFlowInstance) => console.log('flow loaded:', reactFlowInstance);
const onNodeDragStop = (event, node) => console.log('drag stop', node);
const onElementClick = (event, element) => console.log('click', element);

const initBgColor = '#f0e742';

const connectionLineStyle = { stroke: '#fff' };
const snapGrid = [16, 16];
const nodeTypes = {
  selectorNode: ColorSelectorNode,
};

const CustomNodeFlow = () => {
  const [elements, setElements] = useState([]);
  const [bgColor, setBgColor] = useState(initBgColor);

  useEffect(() => {
    const onChange = (event) => {
      setElements((els) =>
        els.map((e) => {
          if (isEdge(e) || e.id !== '2') {
            return e;
          }

          const color = event.target.value;

          setBgColor(color);

          return {
            ...e,
            data: {
              ...e.data,
              color,
            },
          };
        })
      );
    };

    setElements([
      { id: '1', type: 'input', data: { label: 'An input node' }, position: { x: 0, y: 50 }, sourcePosition: 'right' },
      {
        id: '2',
        type: 'selectorNode',
        data: { onChange: onChange, color: initBgColor },
        style: { border: '1px solid #777', padding: 10 },
        position: { x: 250, y: 50 },
      },
      { id: '3', type: 'output', data: { label: 'Output A' }, position: { x: 550, y: 25 }, targetPosition: 'left' },
      { id: '4', type: 'output', data: { label: 'Output B' }, position: { x: 550, y: 100 }, targetPosition: 'left' },

      { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#fff' } },
      { id: 'e2a-3', source: '2__a', target: '3', animated: true, style: { stroke: '#fff' } },
      { id: 'e2b-4', source: '2__b', target: '4', animated: true, style: { stroke: '#fff' } },
    ]);
  }, []);

  const onElementsRemove = (elementsToRemove) => setElements((els) => removeElements(elementsToRemove, els));
  const onConnect = (params) =>
    setElements((els) => addEdge({ ...params, animated: true, style: { stroke: '#fff' } }, els));

  return (
    <ReactFlow
      elements={elements}
      onElementClick={onElementClick}
      onElementsRemove={onElementsRemove}
      onConnect={onConnect}
      onNodeDragStop={onNodeDragStop}
      style={{ background: bgColor }}
      onLoad={onLoad}
      nodeTypes={nodeTypes}
      connectionLineStyle={connectionLineStyle}
      snapToGrid={true}
      snapGrid={snapGrid}
    >
      <MiniMap
        nodeColor={(n) => {
          if (n.type === 'input') return 'blue';
          if (n.type === 'selectorNode') return bgColor;
          if (n.type === 'output') return 'green';
        }}
      />
      <Controls />
    </ReactFlow>
  );
};

export default CustomNodeFlow;

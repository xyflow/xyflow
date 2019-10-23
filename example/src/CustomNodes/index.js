import React, { useState, useEffect } from 'react';

import Graph, { isEdge, removeElements, addEdge, MiniMap, Controls } from 'react-flow';

import SpecialNode from './SpecialNode';
import InputNode from './InputNode';

const onNodeDragStop = node => console.log('drag stop', node);
const onElementClick = element => console.log('click', element);
const onLoad = (graph) => console.log('graph loaded:', graph);

const CustomNodesGraph = () => {
  const [elements, setElements] = useState([]);

  useEffect(() => {
    const onChange = (option, d) => {
      setElements(els => els.map(e => {
        if (isEdge(e) || e.id !== '6') {
          return e;
        }

        return {
          ...e,
          data: {
            ...e.data,
            label: `Option ${option} selected.`
          }
        };
      }));
    };

    const onChangeInput = (input, d) => {
      setElements(els => els.map(e => {
        if (isEdge(e) || e.id !== '8') {
          return e;
        }

        return {
          ...e,
          data: {
            ...e.data,
            input: input || 'write something'
          }
        };
      }));
    };

    setElements([
      { id: '1', type: 'input', data: { label: '1 Tests' }, position: { x: 250, y: 5 } },
      { id: '2', data: { label: '2 This is a node This is a node This is a node This is a node' }, position: { x: 100, y: 100 } },
      { id: '3', data: { label: '3 I bring my own style' }, position: { x: 100, y: 200 }, style: { background: '#eee', color: '#222', border: '1px solid #bbb' } },
      { id: '4', type: 'output', data: { label: '4 nody nodes' }, position: { x: 50, y: 300 } },
      { id: '5', type: 'default', data: { label: '5 Another node'}, position: { x: 400, y: 300 } },
      { id: '6', type: 'special', data: { onChange: onChange, label: '6 no option selected' }, position: { x: 425, y: 375 } },
      { id: '7', type: 'output', data: { label: '7 output' }, position: { x: 250, y: 500 } },
      { id: '8', type: 'text', data: { onChange: onChangeInput, input: 'write something' }, position: { x: 350, y: 100 } },
      { id: 'e1-2', source: '1', target: '2', animated: true },
      { id: 'e1-8', source: '1', target: '8', animated: true },
      { id: 'e2-3', source: '2', target: '3', animated: true },
      { id: 'e3-4', source: '3', target: '4', animated: true },
      { id: 'e3-5', source: '3', target: '5', animated: true },
      { id: 'e5-6b', source: '5', target: '6__b', animated: true  },
      { id: 'e5-6a', source: '5', target: '6__a', animated: true },
      { id: 'e6-7', source: '6', target: '7', animated: true },
    ])
  }, []);

  const addRandomNode = () => {
    setElements(els => els.concat({
      id: (els.length + 1).toString(),
      data: { label: 'Added node' },
      position: { x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight }
    }));
  };
  const onElementsRemove = (elementsToRemove) => setElements(els => removeElements(elementsToRemove, els));
  const onConnect = (params) => setElements(els => addEdge(params, els));

  return (
    <Graph
      elements={elements}
      onElementClick={onElementClick}
      onElementsRemove={onElementsRemove}
      onConnect={onConnect}
      onNodeDragStop={onNodeDragStop}
      style={{ width: '100%', height: '100%' }}
      onLoad={onLoad}
      nodeTypes={{
        special: SpecialNode,
        text: InputNode
      }}
      connectionLineStyle={{ stroke: '#ddd', strokeWidth: 2 }}
      connectionLineType="bezier"
      backgroundColor="#888"
      backgroundGap={16}
      snapToGrid={true}
      snapGrid={[16, 16]}
    >
      <MiniMap
        nodeColor={n => {
          if (n.type === 'input') return 'blue';
          if (n.type === 'output') return 'green';
          if (n.type === 'default') return 'red';

          return '#FFCC00';
        }}
      />
      <Controls />
      <button
        type="button"
        onClick={addRandomNode}
        style={{ position: 'absolute', right: 10, top: 10, zIndex: 4 }}
      >
        add node
      </button>
    </Graph>
  );
}

export default CustomNodesGraph;
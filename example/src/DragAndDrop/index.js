import React, { useState } from 'react';
import ReactFlow, { removeElements, addEdge, Background, project } from 'react-flow-renderer';
import NodeLibrary from './NodeLibrary'
import {v4 as uuid} from 'uuid'
import './index.css'



const onLoad = (reactFlowInstance) => console.log('flow loaded:', reactFlowInstance);
const onNodeDragStop = (event, node) => console.log('drag stop', node);
const onElementClick = (event, element) => console.log('click', element);

const nodeStore = {
  'Node1': (position) => ({ id: uuid().toString(), type: 'input', data: { label: 'Node 1' }, position: position }),
  'Node2': (position) => ({ id: uuid().toString(), data: { label: 'Node 2' }, position: position }),
}

const initialElements = [
  { id: '1', type: 'input', data: { label: 'Node 1' }, position: { x: 250, y: 5 } },
  { id: '2', data: { label: 'Node 2' }, position: { x: 100, y: 100 } },
  { id: 'e1-2', source: '1', target: '2', animated: true },
];

const DragAndDrop = () => {
  const [elements, setElements] = useState(initialElements);

  const onElementsRemove = (elementsToRemove) => setElements((els) => removeElements(elementsToRemove, els));
  const onConnect = (params) => setElements((els) => addEdge(params, els));

  const handleDrop = (event) => {
    const data = JSON.parse(event.dataTransfer.getData('dragItem'))
    if (data) {
      const mouseX = event.clientX
      const mouseY = event.clientY
      const position = project({x: mouseX, y: mouseY})
      position.y -= 30 //offset due to navbar/header

      const node = nodeStore[data.name](position)
      setElements((oldElements) => [...oldElements, node])
    }
  }

  return (
    
      <ReactFlow
        elements={elements}
        onLoad={onLoad}
        onElementClick={onElementClick}
        onElementsRemove={onElementsRemove}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        className="react-flow-basic-example"
        defaultZoom={1.5}
        minZoom={0.2}
        maxZoom={4}
        onDrop={handleDrop}
      >
        <Background variant="lines" />
        <NodeLibrary />
      </ReactFlow>
  );
};

export default DragAndDrop;

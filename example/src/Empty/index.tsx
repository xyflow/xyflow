import React, { useState, MouseEvent, CSSProperties } from 'react';

import ReactFlow, {
  removeElements,
  addEdge,
  MiniMap,
  Controls,
  Background,
  OnLoadParams,
  Elements,
  ElementId,
  Node,
  FlowElement,
  BackgroundVariant,
  Connection,
  Edge,
} from 'react-flow-renderer';

const onLoad = (reactFlowInstance: OnLoadParams) => console.log('flow loaded:', reactFlowInstance);
const onElementClick = (_: MouseEvent, element: FlowElement) => console.log('click', element);
const onNodeDragStop = (_: MouseEvent, node: Node) => console.log('drag stop', node);

const buttonStyle: CSSProperties = { position: 'absolute', left: 10, top: 10, zIndex: 4 };

const EmptyFlow = () => {
  const [elements, setElements] = useState<Elements>([]);
  const onElementsRemove = (elementsToRemove: Elements) => setElements((els) => removeElements(elementsToRemove, els));
  const onConnect = (params: Connection | Edge) => setElements((els) => addEdge(params, els));
  const addRandomNode = () => {
    const nodeId: ElementId = (elements.length + 1).toString();
    const newNode: Node = {
      id: nodeId,
      data: { label: `Node: ${nodeId}` },
      position: { x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight },
    };
    setElements((els) => els.concat(newNode));
  };

  return (
    <ReactFlow
      elements={elements}
      onLoad={onLoad}
      onElementClick={onElementClick}
      onElementsRemove={onElementsRemove}
      onConnect={(p) => onConnect(p)}
      onNodeDragStop={onNodeDragStop}
      onlyRenderVisibleElements={false}
    >
      <MiniMap />
      <Controls />
      <Background variant={BackgroundVariant.Lines} />

      <button type="button" onClick={addRandomNode} style={buttonStyle}>
        add node
      </button>
    </ReactFlow>
  );
};

export default EmptyFlow;

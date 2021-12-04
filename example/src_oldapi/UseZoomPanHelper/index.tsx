import React, { useState, useCallback } from 'react';

import ReactFlow, {
  removeElements,
  addEdge,
  Background,
  MiniMap,
  useZoomPanHelper,
  ReactFlowProvider,
  Elements,
  ElementId,
  Connection,
  Edge,
} from 'react-flow-renderer';

const initialElements: Elements = [
  { id: '1', type: 'input', data: { label: 'Node 1' }, position: { x: 250, y: 5 }, className: 'light' },
  { id: '2', data: { label: 'Node 2' }, position: { x: 100, y: 100 }, className: 'light' },
  { id: '3', data: { label: 'Node 3' }, position: { x: 400, y: 100 }, className: 'light' },
  { id: '4', data: { label: 'Node 4' }, position: { x: 400, y: 200 }, className: 'light' },
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3' },
];

let id = 5;
const getId = (): ElementId => `${id++}`;

const UseZoomPanHelperFlow = () => {
  const [elements, setElements] = useState<Elements>(initialElements);
  const onElementsRemove = (elementsToRemove: Elements) => setElements((els) => removeElements(elementsToRemove, els));
  const onConnect = (params: Connection | Edge) => setElements((els) => addEdge(params, els));
  const { project, setCenter, zoomIn, zoomOut } = useZoomPanHelper();

  const onPaneClick = useCallback(
    (evt) => {
      const projectedPosition = project({ x: evt.clientX, y: evt.clientY - 40 });

      setElements((els) =>
        els.concat({
          id: getId(),
          position: projectedPosition,
          data: {
            label: `${projectedPosition.x}-${projectedPosition.y}`,
          },
        })
      );
    },
    [project]
  );

  const onElementClick = useCallback(
    (_, element) => {
      const { x, y } = element.position;
      setCenter(x, y, 1);
    },
    [setCenter]
  );

  return (
    <ReactFlow
      elements={elements}
      onElementClick={onElementClick}
      onElementsRemove={onElementsRemove}
      onConnect={onConnect}
      onPaneClick={onPaneClick}
    >
      <div style={{ position: 'absolute', left: 0, top: 0, zIndex: 100 }}>
        <button onClick={() => zoomIn(1200)}>zoomIn</button>
        <button onClick={() => zoomOut(0)}>zoomOut</button>
      </div>
      <Background />
      <MiniMap />
    </ReactFlow>
  );
};

const WrappedFlow = () => (
  <ReactFlowProvider>
    <UseZoomPanHelperFlow />
  </ReactFlowProvider>
);

export default WrappedFlow;

import React, { useState, useCallback, CSSProperties } from 'react';

import ReactFlow, {
  NodeTypesType,
  addEdge,
  useZoomPanHelper,
  ReactFlowProvider,
  Elements,
  Connection,
  Edge,
  ElementId,
  useUpdateNodeInternals,
  Position,
  isEdge,
} from 'react-flow-renderer';
import CustomNode from './CustomNode';

const initialHandleCount = 1;

const initialElements: Elements = [
  {
    id: '1',
    type: 'custom',
    data: { label: 'Node 1', handleCount: initialHandleCount, handlePosition: 0 },
    position: { x: 250, y: 5 },
  },
];

const buttonWrapperStyles: CSSProperties = { position: 'absolute', right: 10, top: 10, zIndex: 10 };

const nodeTypes: NodeTypesType = {
  custom: CustomNode,
};

let id = 5;
const getId = (): ElementId => `${id++}`;

const UpdateNodeInternalsFlow = () => {
  const [elements, setElements] = useState<Elements>(initialElements);
  const updateNodeInternals = useUpdateNodeInternals();
  const onConnect = (params: Connection | Edge) => setElements((els) => addEdge(params, els));
  const { project } = useZoomPanHelper();

  const onPaneClick = useCallback(
    (evt) =>
      setElements((els) =>
        els.concat({
          id: getId(),
          position: project({ x: evt.clientX, y: evt.clientY - 40 }),
          data: { label: 'new node' },
          targetPosition: Position.Left,
          sourcePosition: Position.Right,
        })
      ),
    [project]
  );

  const toggleHandleCount = useCallback(() => {
    setElements((els) =>
      els.map((el) => {
        if (isEdge(el)) {
          return el;
        }

        return { ...el, data: { ...el.data, handleCount: el.data?.handleCount === 1 ? 2 : 1 } };
      })
    );
  }, []);

  const toggleHandlePosition = useCallback(() => {
    setElements((els) =>
      els.map((el) => {
        if (isEdge(el)) {
          return el;
        }

        return { ...el, data: { ...el.data, handlePosition: el.data?.handlePosition === 0 ? 1 : 0 } };
      })
    );
  }, []);

  const updateNode = useCallback(() => updateNodeInternals('1'), [updateNodeInternals]);

  return (
    <ReactFlow elements={elements} nodeTypes={nodeTypes} onConnect={onConnect} onPaneClick={onPaneClick}>
      <div style={buttonWrapperStyles}>
        <button onClick={toggleHandleCount}>toggle handle count</button>
        <button onClick={toggleHandlePosition}>toggle handle position</button>
        <button onClick={updateNode}>update node internals</button>
      </div>
    </ReactFlow>
  );
};

const WrappedFlow = () => (
  <ReactFlowProvider>
    <UpdateNodeInternalsFlow />
  </ReactFlowProvider>
);

export default WrappedFlow;

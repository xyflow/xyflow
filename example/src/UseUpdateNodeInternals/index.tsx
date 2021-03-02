import React, { useState, useCallback, CSSProperties, useRef } from 'react';

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
} from 'react-flow-renderer';
import CustomNode from './CustomNode';

const initialHandleCount = 1;

const initialElements: Elements = [
  {
    id: '1',
    type: 'custom',
    data: { label: 'Node 1', handleCount: initialHandleCount },
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
  const handleCount = useRef<number>(initialHandleCount);
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
    handleCount.current = handleCount.current === 1 ? 2 : 1;
    setElements((els) => els.map((el) => ({ ...el, data: { ...el.data, handleCount: handleCount.current } })));
  }, []);

  const updateNode = useCallback(() => updateNodeInternals('1'), [updateNodeInternals]);

  return (
    <ReactFlow elements={elements} nodeTypes={nodeTypes} onConnect={onConnect} onPaneClick={onPaneClick}>
      <div style={buttonWrapperStyles}>
        <button onClick={toggleHandleCount}>toggle handle count</button>
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

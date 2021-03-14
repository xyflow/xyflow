import React, { useState, useCallback } from 'react';

import ReactFlow, {
  NodeTypesType,
  addEdge,
  useZoomPanHelper,
  ReactFlowProvider,
  Elements,
  Connection,
  Edge,
  ElementId,
  ConnectionLineType,
  ConnectionMode,
  updateEdge,
} from 'react-flow-renderer';
import CustomNode from './CustomNode';

const initialElements: Elements = [
  {
    id: '1',
    type: 'custom',
    position: { x: 150, y: 100 },
  },
  {
    id: '2',
    type: 'custom',
    position: { x: 300, y: 100 },
  },
  {
    id: '3',
    type: 'custom',
    position: { x: 450, y: 100 },
  },
  {
    id: 'e1-2',
    source: '2',
    target: '3',
    sourceHandle: 'right',
  },
];

const nodeTypes: NodeTypesType = {
  custom: CustomNode,
};

let id = 4;
const getId = (): ElementId => `${id++}`;

const UpdateNodeInternalsFlow = () => {
  const [elements, setElements] = useState<Elements>(initialElements);
  const onConnect = (params: Connection | Edge) =>
    setElements((els) => addEdge({ ...params, type: 'smoothstep' }, els));
  const { project } = useZoomPanHelper();
  const onEdgeUpdate = (oldEdge: Edge, newConnection: Connection) =>
    setElements((els) => updateEdge(oldEdge, newConnection, els));

  const onPaneClick = useCallback(
    (evt) =>
      setElements((els) =>
        els.concat({
          id: getId(),
          position: project({ x: evt.clientX, y: evt.clientY - 40 }),
          type: 'custom',
        })
      ),
    [project]
  );

  return (
    <ReactFlow
      elements={elements}
      nodeTypes={nodeTypes}
      onConnect={onConnect}
      onPaneClick={onPaneClick}
      connectionLineType={ConnectionLineType.SmoothStep}
      connectionMode={ConnectionMode.Loose}
      onEdgeUpdate={onEdgeUpdate}
    />
  );
};

const WrappedFlow = () => (
  <ReactFlowProvider>
    <UpdateNodeInternalsFlow />
  </ReactFlowProvider>
);

export default WrappedFlow;

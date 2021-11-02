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
  ArrowHeadType,
} from 'react-flow-renderer';
import CustomNode from './CustomNode';

const initialElements: Elements = [
  {
    id: '00',
    type: 'custom',
    position: { x: 300, y: 250 },
  },
  {
    id: '01',
    type: 'custom',
    position: { x: 100, y: 50 },
  },
  {
    id: '02',
    type: 'custom',
    position: { x: 500, y: 50 },
  },
  {
    id: '03',
    type: 'custom',
    position: { x: 500, y: 500 },
  },
  {
    id: '04',
    type: 'custom',
    position: { x: 100, y: 500 },
  },
  {
    id: '10',
    type: 'custom',
    position: { x: 300, y: 5 },
  },
  {
    id: '20',
    type: 'custom',
    position: { x: 600, y: 250 },
  },
  {
    id: '30',
    type: 'custom',
    position: { x: 300, y: 600 },
  },
  {
    id: '40',
    type: 'custom',
    position: { x: 5, y: 250 },
  },
  {
    id: 'e0-1a',
    source: '00',
    target: '01',
    sourceHandle: 'left',
    targetHandle: 'bottom',
    type: 'default',
    arrowHeadType: ArrowHeadType.Arrow,
  },
  {
    id: 'e0-1b',
    source: '00',
    target: '01',
    sourceHandle: 'top',
    targetHandle: 'right',
    type: 'default',
    arrowHeadType: ArrowHeadType.Arrow,
  },
  {
    id: 'e0-2a',
    source: '00',
    target: '02',
    sourceHandle: 'top',
    targetHandle: 'left',
    type: 'default',
    arrowHeadType: ArrowHeadType.Arrow,
  },
  {
    id: 'e0-2b',
    source: '00',
    target: '02',
    sourceHandle: 'right',
    targetHandle: 'bottom',
    type: 'default',
    arrowHeadType: ArrowHeadType.Arrow,
  },
  {
    id: 'e0-3a',
    source: '00',
    target: '03',
    sourceHandle: 'right',
    targetHandle: 'top',
    type: 'default',
    arrowHeadType: ArrowHeadType.Arrow,
  },
  {
    id: 'e0-3b',
    source: '00',
    target: '03',
    sourceHandle: 'bottom',
    targetHandle: 'left',
    type: 'default',
    arrowHeadType: ArrowHeadType.Arrow,
  },
  {
    id: 'e0-4a',
    source: '00',
    target: '04',
    sourceHandle: 'bottom',
    targetHandle: 'right',
    type: 'default',
    arrowHeadType: ArrowHeadType.Arrow,
  },
  {
    id: 'e0-4b',
    source: '00',
    target: '04',
    sourceHandle: 'left',
    targetHandle: 'top',
    type: 'default',
    arrowHeadType: ArrowHeadType.Arrow,
  },
  {
    id: 'e0-10',
    source: '00',
    target: '10',
    sourceHandle: 'top',
    targetHandle: 'bottom',
    type: 'default',
    arrowHeadType: ArrowHeadType.Arrow,
  },
  {
    id: 'e0-20',
    source: '00',
    target: '20',
    sourceHandle: 'right',
    targetHandle: 'left',
    type: 'default',
    arrowHeadType: ArrowHeadType.Arrow,
  },
  {
    id: 'e0-30',
    source: '00',
    target: '30',
    sourceHandle: 'bottom',
    targetHandle: 'top',
    type: 'default',
    arrowHeadType: ArrowHeadType.Arrow,
  },
  {
    id: 'e0-40',
    source: '00',
    target: '40',
    sourceHandle: 'left',
    targetHandle: 'right',
    type: 'default',
    arrowHeadType: ArrowHeadType.Arrow,
  },
];

const nodeTypes: NodeTypesType = {
  custom: CustomNode,
};

let id = 4;
const getId = (): ElementId => `${id++}`;

const UpdateNodeInternalsFlow = () => {
  const [elements, setElements] = useState<Elements>(initialElements);
  const onConnect = (params: Connection | Edge) => setElements((els) => addEdge({ ...params, type: 'default' }, els));
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
      connectionLineType={ConnectionLineType.Bezier}
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

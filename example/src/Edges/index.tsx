import React, { useState, MouseEvent } from 'react';

import ReactFlow, {
  removeElements,
  addEdge,
  MiniMap,
  Controls,
  Background,
  OnLoadParams,
  FlowElement,
  EdgeTypesType,
  Elements,
  Connection,
  Edge,
  ArrowHeadType,
  Node,
} from 'react-flow-renderer';

import CustomEdge from './CustomEdge';
import CustomEdge2 from './CustomEdge2';

const onLoad = (reactFlowInstance: OnLoadParams) => reactFlowInstance.fitView();
const onNodeDragStop = (_: MouseEvent, node: Node) => console.log('drag stop', node);
const onElementClick = (_: MouseEvent, element: FlowElement) => console.log('click', element);

const initialElements: Elements = [
  { id: '1', type: 'input', data: { label: 'Input 1' }, position: { x: 250, y: 0 } },
  { id: '2', data: { label: 'Node 2' }, position: { x: 150, y: 100 } },
  { id: '2a', data: { label: 'Node 2a' }, position: { x: 0, y: 180 } },
  { id: '3', data: { label: 'Node 3' }, position: { x: 250, y: 200 } },
  { id: '4', data: { label: 'Node 4' }, position: { x: 400, y: 300 } },
  { id: '3a', data: { label: 'Node 3a' }, position: { x: 150, y: 300 } },
  { id: '5', data: { label: 'Node 5' }, position: { x: 250, y: 400 } },
  { id: '6', type: 'output', data: { label: 'Output 6' }, position: { x: 50, y: 550 } },
  { id: '7', type: 'output', data: { label: 'Output 7' }, position: { x: 250, y: 550 } },
  { id: '8', type: 'output', data: { label: 'Output 8' }, position: { x: 525, y: 600 } },
  { id: '9', type: 'output', data: { label: 'Output 9' }, position: { x: 675, y: 500 } },
  { id: 'e1-2', source: '1', target: '2', label: 'bezier edge (default)', className: 'normal-edge' },
  { id: 'e2-2a', source: '2', target: '2a', type: 'smoothstep', label: 'smoothstep edge' },
  { id: 'e2-3', source: '2', target: '3', type: 'step', label: 'step edge' },
  { id: 'e3-4', source: '3', target: '4', type: 'straight', label: 'straight edge' },
  { id: 'e3-3a', source: '3', target: '3a', type: 'straight', label: 'label only edge', style: { stroke: 'none' } },
  { id: 'e3-5', source: '4', target: '5', animated: true, label: 'animated styled edge', style: { stroke: 'red' } },
  {
    id: 'e5-6',
    source: '5',
    target: '6',
    label: (
      <>
        <tspan>i am using</tspan>
        <tspan dy={10} x={0}>
          {'<tspan>'}
        </tspan>
      </>
    ),
    labelStyle: { fill: 'red', fontWeight: 700 },
    arrowHeadType: ArrowHeadType.Arrow,
  },
  {
    id: 'e5-7',
    source: '5',
    target: '7',
    label: 'label with styled bg',
    labelBgPadding: [8, 4],
    labelBgBorderRadius: 4,
    labelBgStyle: { fill: '#FFCC00', color: '#fff', fillOpacity: 0.7 },
    arrowHeadType: ArrowHeadType.ArrowClosed,
  },
  {
    id: 'e5-8',
    source: '5',
    target: '8',
    type: 'custom',
    data: { text: 'custom edge' },
    arrowHeadType: ArrowHeadType.ArrowClosed,
  },
  {
    id: 'e5-9',
    source: '5',
    target: '9',
    type: 'custom2',
    data: { text: 'custom edge 2' },
  },
];

const edgeTypes: EdgeTypesType = {
  custom: CustomEdge,
  custom2: CustomEdge2,
};

const EdgesFlow = () => {
  const [elements, setElements] = useState<Elements>(initialElements);

  const onElementsRemove = (elementsToRemove: Elements) => setElements((els) => removeElements(elementsToRemove, els));
  const onConnect = (params: Connection | Edge) => setElements((els) => addEdge(params, els));

  return (
    <ReactFlow
      elements={elements}
      onElementClick={onElementClick}
      onElementsRemove={onElementsRemove}
      onConnect={onConnect}
      onNodeDragStop={onNodeDragStop}
      onLoad={onLoad}
      snapToGrid={true}
      edgeTypes={edgeTypes}
    >
      <MiniMap />
      <Controls />
      <Background />
    </ReactFlow>
  );
};

export default EdgesFlow;

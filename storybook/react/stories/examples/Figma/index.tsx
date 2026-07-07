import { ReactFlow, Background, BackgroundVariant, Node, Edge, SelectionMode, Controls, Panel } from '@xyflow/react';

const MULTI_SELECT_KEY = ['Meta', 'Shift'];

const initialNodes: Node[] = [
  { id: '1', type: 'input', data: { label: 'Node 1' }, position: { x: 250, y: 5 }, className: 'light' },
  { id: '2', data: { label: 'Node 2' }, position: { x: 100, y: 100 }, className: 'light' },
  { id: '3', data: { label: 'Node 3' }, position: { x: 400, y: 100 }, className: 'light' },
  { id: '4', data: { label: 'Node 4' }, position: { x: 400, y: 200 }, className: 'light' },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3' },
];

const onPaneContextMenu = (e: any) => {
  e.preventDefault();
  console.log('context menu');
};

const panOnDrag = [1, 2];

const onMoveStart = (e: any) => console.log('move start', e);
const onMove = (e: any) => console.log('move', e);
const onMoveEnd = (e: any) => console.log('move end', e);

const BasicFlow = () => {
  return (
    <ReactFlow
      defaultNodes={initialNodes}
      defaultEdges={initialEdges}
      selectionOnDrag={true}
      selectionMode={SelectionMode.Partial}
      panOnDrag={panOnDrag}
      panOnScroll
      paneClickDistance={100}
      zoomActivationKeyCode="Meta"
      multiSelectionKeyCode={MULTI_SELECT_KEY}
      onPaneContextMenu={onPaneContextMenu}
      fitView
      selectNodesOnDrag={false}
      onSelectionContextMenu={onPaneContextMenu}
      onMoveStart={onMoveStart}
      onMove={onMove}
      onMoveEnd={onMoveEnd}
      onPaneClick={(e) => console.log('pane click', e)}
      onSelectionStart={(e) => console.log('on selection start', e)}
      onSelectionEnd={(e) => console.log('on selection end', e)}
      onPointerDown={(e) => console.log('pointer down', e)}
      onPointerUp={(e) => console.log('pointer up', e)}
      onClick={(e) => console.log('click', e)}
    >
      <Background variant={BackgroundVariant.Cross} />
      <Controls />
      <Panel position="top-right">
        <input type={'text'} placeholder={'name'} />
      </Panel>
    </ReactFlow>
  );
};

export default BasicFlow;

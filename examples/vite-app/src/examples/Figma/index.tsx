import ReactFlow, { Background, BackgroundVariant, Node, Edge, SelectionMode, Viewport, Controls } from 'reactflow';

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

const onMoveStart = (e: any, viewport: Viewport) => console.log('move start', e, viewport);
const onMoveEnd = (e: any, viewport: Viewport) => console.log('move end', e, viewport);

const BasicFlow = () => {
  return (
    <ReactFlow
      defaultNodes={initialNodes}
      defaultEdges={initialEdges}
      selectionOnDrag
      selectionMode={SelectionMode.Partial}
      panOnDrag={panOnDrag}
      panOnScroll
      multiSelectionKeyCode={MULTI_SELECT_KEY}
      onPaneContextMenu={onPaneContextMenu}
      fitView
      selectNodesOnDrag={false}
      onSelectionContextMenu={onPaneContextMenu}
      onMoveStart={onMoveStart}
      onMoveEnd={onMoveEnd}
    >
      <Background variant={BackgroundVariant.Cross} />
      <Controls />
      <div style={{ position: 'absolute', right: 10, top: 10, zIndex: 4 }}>
        <input type={'text'} placeholder={'name'} />
      </div>
    </ReactFlow>
  );
};

export default BasicFlow;

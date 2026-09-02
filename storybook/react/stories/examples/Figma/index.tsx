import { ReactFlow, Background, BackgroundVariant, Node, Edge, SelectionMode, Controls, Panel } from '@xyflow/react';

const MULTI_SELECT_KEY = ['Meta', 'Shift'];

import { defaultFlowProps } from '@shared/defaultFlow';

const { nodes: initialNodes = [], edges: initialEdges = [], fitViewOptions } = defaultFlowProps;

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

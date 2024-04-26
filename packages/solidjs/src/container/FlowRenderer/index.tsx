
import { useStore } from '../../hooks/useStore';
import { useGlobalKeyHandler } from '../../hooks/useGlobalKeyHandler';
import { useKeyPress } from '../../hooks/useKeyPress';
import { GraphViewProps } from '../GraphView';
import { ZoomPane } from '../ZoomPane';
import { Pane } from '../Pane';
import { NodesSelection } from '../../components/NodesSelection';
import type { SolidFlowState, Node } from '../../types';
import { ParentProps, Show, createEffect } from 'solid-js';

export type FlowRendererProps<NodeType extends Node = Node> = ParentProps<Omit<
  GraphViewProps<NodeType>,
  | 'snapToGrid'
  | 'nodeTypes'
  | 'edgeTypes'
  | 'snapGrid'
  | 'connectionLineType'
  | 'connectionLineContainerStyle'
  | 'arrowHeadColor'
  | 'onlyRenderVisibleElements'
  | 'selectNodesOnDrag'
  | 'defaultMarkerColor'
  | 'rfId'
  | 'nodeOrigin'
> & {
  isControlledViewport: boolean;
}>;

const selector = (s: SolidFlowState) => {
  return { nodesSelectionActive: s.nodesSelectionActive, userSelectionActive: s.userSelectionActive };
};

function FlowRendererComponent<NodeType extends Node = Node>(p: FlowRendererProps<NodeType>){
//   children,
//   onPaneClick,
//   onPaneMouseEnter,
//   onPaneMouseMove,
//   onPaneMouseLeave,
//   onPaneContextMenu,
//   onPaneScroll,
//   deleteKeyCode,
//   selectionKeyCode,
//   selectionOnDrag,
//   selectionMode,
//   onSelectionStart,
//   onSelectionEnd,
//   multiSelectionKeyCode,
//   panActivationKeyCode,
//   zoomActivationKeyCode,
//   elementsSelectable,
//   zoomOnScroll,
//   zoomOnPinch,
//   panOnScroll: _panOnScroll,
//   panOnScrollSpeed,
//   panOnScrollMode,
//   zoomOnDoubleClick,
//   panOnDrag: _panOnDrag,
//   defaultViewport,
//   translateExtent,
//   minZoom,
//   maxZoom,
//   preventScrolling,
//   onSelectionContextMenu,
//   noWheelClassName,
//   noPanClassName,
//   disableKeyboardA11y,
//   onViewportChange,
//   isControlledViewport,
// }: FlowRendererProps<NodeType>) {

  const { nodesSelectionActive, userSelectionActive } = useStore(selector);
  // console.log("selectionKeyCode", p.selectionKeyCode)
  const selectionKeyPressed = useKeyPress(() => p.selectionKeyCode);
  const panActivationKeyPressed = useKeyPress(() => p.panActivationKeyCode);

  const panOnDrag = () => panActivationKeyPressed() || p.panOnDrag;
  const panOnScroll = () => panActivationKeyPressed() || p.panOnScroll;
  const isSelecting = () => selectionKeyPressed() || userSelectionActive.get() || (p.selectionOnDrag && panOnDrag() !== true);

  useGlobalKeyHandler({ deleteKeyCode: () => p.deleteKeyCode, multiSelectionKeyCode: () => p.multiSelectionKeyCode });

  createEffect(() => {
    console.log("paneOnDrag", panOnDrag())
  });

  createEffect(() => { 
    console.log("selection keypressed", selectionKeyPressed())  
  })

  return (
    <ZoomPane
      onPaneContextMenu={p.onPaneContextMenu}
      elementsSelectable={p.elementsSelectable}
      zoomOnScroll={p.zoomOnScroll}
      zoomOnPinch={p.zoomOnPinch}
      panOnScroll={panOnScroll()}
      panOnScrollSpeed={p.panOnScrollSpeed}
      panOnScrollMode={p.panOnScrollMode}
      zoomOnDoubleClick={p.zoomOnDoubleClick}
      panOnDrag={!selectionKeyPressed() && panOnDrag()}
      defaultViewport={p.defaultViewport}
      translateExtent={p.translateExtent}
      minZoom={p.minZoom}
      maxZoom={p.maxZoom}
      zoomActivationKeyCode={p.zoomActivationKeyCode}
      preventScrolling={p.preventScrolling}
      noWheelClassName={p.noWheelClassName}
      noPanClassName={p.noPanClassName}
      onViewportChange={p.onViewportChange}
      isControlledViewport={p.isControlledViewport}
    >
      <Pane
        onSelectionStart={p.onSelectionStart}
        onSelectionEnd={p.onSelectionEnd}
        onPaneClick={p.onPaneClick}
        onPaneMouseEnter={p.onPaneMouseEnter}
        onPaneMouseMove={p.onPaneMouseMove}
        onPaneMouseLeave={p.onPaneMouseLeave}
        onPaneContextMenu={p.onPaneContextMenu}
        onPaneScroll={p.onPaneScroll}
        panOnDrag={panOnDrag()}
        isSelecting={!!isSelecting()}
        selectionMode={p.selectionMode}
      >
        {p.children}
        <Show when={nodesSelectionActive.get()}>
          <NodesSelection
            onSelectionContextMenu={p.onSelectionContextMenu}
            noPanClassName={p.noPanClassName}
            disableKeyboardA11y={p.disableKeyboardA11y}
          />
        </Show>
      </Pane>
    </ZoomPane>
  );
}

FlowRendererComponent.displayName = 'FlowRenderer';

export const FlowRenderer = FlowRendererComponent ;

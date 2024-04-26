import { useStore } from '../../hooks/useStore';
import { useGlobalKeyHandler } from '../../hooks/useGlobalKeyHandler';
import { useKeyPress } from '../../hooks/useKeyPress';
import { GraphViewProps } from '../GraphView';
import { ZoomPane } from '../ZoomPane';
import { Pane } from '../Pane';
import { NodesSelection } from '../../components/NodesSelection';
import type { SolidFlowState, Node } from '../../types';
import { ParentProps, Show } from 'solid-js';

export type FlowRendererProps<NodeType extends Node = Node> = ParentProps<
  Omit<
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
    | 'nodeClickDistance'
  > & {
    isControlledViewport: boolean;
  }
>;

const win = typeof window !== 'undefined' ? window : undefined;

const selector = (s: SolidFlowState) => ({
  nodesSelectionActive: () => s.nodesSelectionActive.get(),
  userSelectionActive: () => s.userSelectionActive.get(),
});

function FlowRendererComponent<NodeType extends Node = Node>(p: FlowRendererProps<NodeType>) {
  const store = useStore(selector);
  const selectionKeyPressed = useKeyPress(
    () => p.selectionKeyCode,
    () => ({ target: win })
  );
  const panActivationKeyPressed = useKeyPress(
    () => p.panActivationKeyCode,
    () => ({ target: win })
  );

  const panOnDrag = () => panActivationKeyPressed() || p.panOnDrag;
  const panOnScroll = () => panActivationKeyPressed() || p.panOnScroll;
  const _selectionOnDrag = () => p.selectionOnDrag && panOnDrag() !== true;
  const isSelecting = () => selectionKeyPressed() || store.userSelectionActive() || _selectionOnDrag();

  useGlobalKeyHandler({ deleteKeyCode: () => p.deleteKeyCode, multiSelectionKeyCode: () => p.multiSelectionKeyCode });

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
      paneClickDistance={p.paneClickDistance}
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
        selectionKeyPressed={selectionKeyPressed()}
        selectionOnDrag={_selectionOnDrag()}
      >
        {p.children}
        <Show when={store.nodesSelectionActive()}>
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

export const FlowRenderer = FlowRendererComponent;

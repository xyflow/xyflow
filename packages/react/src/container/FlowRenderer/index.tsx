import { memo, type ReactNode } from 'react';

import { useStore } from '../../hooks/useStore';
import { useGlobalKeyHandler } from '../../hooks/useGlobalKeyHandler';
import { useKeyPress } from '../../hooks/useKeyPress';
import { GraphViewProps } from '../GraphView';
import { ZoomPane } from '../ZoomPane';
import { Pane } from '../Pane';
import { NodesSelection } from '../../components/NodesSelection';
import type { ReactFlowState, Node } from '../../types';

export type FlowRendererProps<NodeType extends Node = Node> = Omit<
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
  children: ReactNode;
};

const selector = (s: ReactFlowState) => {
  return { nodesSelectionActive: s.nodesSelectionActive, userSelectionActive: s.userSelectionActive };
};

function FlowRendererComponent<NodeType extends Node = Node>({
  children,
  onPaneClick,
  onPaneMouseEnter,
  onPaneMouseMove,
  onPaneMouseLeave,
  onPaneContextMenu,
  onPaneScroll,
  deleteKeyCode,
  selectionKeyCode,
  selectionOnDrag,
  selectionMode,
  onSelectionStart,
  onSelectionEnd,
  multiSelectionKeyCode,
  panActivationKeyCode,
  zoomActivationKeyCode,
  elementsSelectable,
  zoomOnScroll,
  zoomOnPinch,
  panOnScroll: _panOnScroll,
  panOnScrollSpeed,
  panOnScrollMode,
  zoomOnDoubleClick,
  panOnDrag: _panOnDrag,
  defaultViewport,
  translateExtent,
  minZoom,
  maxZoom,
  preventScrolling,
  onSelectionContextMenu,
  noWheelClassName,
  noPanClassName,
  disableKeyboardA11y,
  onViewportChange,
  isControlledViewport,
}: FlowRendererProps<NodeType>) {
  const { nodesSelectionActive, userSelectionActive } = useStore(selector);
  const selectionKeyPressed = useKeyPress(selectionKeyCode);
  const panActivationKeyPressed = useKeyPress(panActivationKeyCode);

  const panOnDrag = panActivationKeyPressed || _panOnDrag;
  const panOnScroll = panActivationKeyPressed || _panOnScroll;
  const isSelecting = selectionKeyPressed || userSelectionActive || (selectionOnDrag && panOnDrag !== true);

  useGlobalKeyHandler({ deleteKeyCode, multiSelectionKeyCode });

  return (
    <ZoomPane
      onPaneContextMenu={onPaneContextMenu}
      elementsSelectable={elementsSelectable}
      zoomOnScroll={zoomOnScroll}
      zoomOnPinch={zoomOnPinch}
      panOnScroll={panOnScroll}
      panOnScrollSpeed={panOnScrollSpeed}
      panOnScrollMode={panOnScrollMode}
      zoomOnDoubleClick={zoomOnDoubleClick}
      panOnDrag={!selectionKeyPressed && panOnDrag}
      defaultViewport={defaultViewport}
      translateExtent={translateExtent}
      minZoom={minZoom}
      maxZoom={maxZoom}
      zoomActivationKeyCode={zoomActivationKeyCode}
      preventScrolling={preventScrolling}
      noWheelClassName={noWheelClassName}
      noPanClassName={noPanClassName}
      onViewportChange={onViewportChange}
      isControlledViewport={isControlledViewport}
    >
      <Pane
        onSelectionStart={onSelectionStart}
        onSelectionEnd={onSelectionEnd}
        onPaneClick={onPaneClick}
        onPaneMouseEnter={onPaneMouseEnter}
        onPaneMouseMove={onPaneMouseMove}
        onPaneMouseLeave={onPaneMouseLeave}
        onPaneContextMenu={onPaneContextMenu}
        onPaneScroll={onPaneScroll}
        panOnDrag={panOnDrag}
        isSelecting={!!isSelecting}
        selectionMode={selectionMode}
      >
        {children}
        {nodesSelectionActive && (
          <NodesSelection
            onSelectionContextMenu={onSelectionContextMenu}
            noPanClassName={noPanClassName}
            disableKeyboardA11y={disableKeyboardA11y}
          />
        )}
      </Pane>
    </ZoomPane>
  );
}

FlowRendererComponent.displayName = 'FlowRenderer';

export const FlowRenderer = memo(FlowRendererComponent) as typeof FlowRendererComponent;

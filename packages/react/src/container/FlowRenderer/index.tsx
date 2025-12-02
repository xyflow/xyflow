import { memo, type ReactNode } from 'react';
import { shallow } from 'zustand/shallow';

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
  | 'nodeClickDistance'
> & {
  isControlledViewport: boolean;
  children: ReactNode;
};

const win = typeof window !== 'undefined' ? window : undefined;

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
  paneClickDistance,
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
  const { nodesSelectionActive, userSelectionActive } = useStore(selector, shallow);
  const selectionKeyPressed = useKeyPress(selectionKeyCode, { target: win });
  const panActivationKeyPressed = useKeyPress(panActivationKeyCode, { target: win });

  const panOnDrag = panActivationKeyPressed || _panOnDrag;
  const panOnScroll = panActivationKeyPressed || _panOnScroll;
  const _selectionOnDrag = selectionOnDrag && panOnDrag !== true;
  const isSelecting = selectionKeyPressed || userSelectionActive || _selectionOnDrag;

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
      paneClickDistance={paneClickDistance}
      selectionOnDrag={_selectionOnDrag}
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
        selectionKeyPressed={selectionKeyPressed}
        paneClickDistance={paneClickDistance}
        selectionOnDrag={_selectionOnDrag}
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

import { memo } from 'react';
import type { ReactNode } from 'react';

import { useStore } from '../../hooks/useStore';
import useGlobalKeyHandler from '../../hooks/useGlobalKeyHandler';
import useKeyPress from '../../hooks/useKeyPress';
import { GraphViewProps } from '../GraphView';
import ZoomPane from '../ZoomPane';
import Pane from '../Pane';
import NodesSelection from '../../components/NodesSelection';
import type { ReactFlowState } from '../../types';

export type FlowRendererProps = Omit<
  GraphViewProps,
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
  children: ReactNode;
};

const selector = (s: ReactFlowState) => s.nodesSelectionActive;

const FlowRenderer = ({
  children,
  onPaneClick,
  onPaneMouseEnter,
  onPaneMouseMove,
  onPaneMouseLeave,
  onPaneContextMenu,
  onPaneScroll,
  deleteKeyCode,
  onMove,
  onMoveStart,
  onMoveEnd,
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
  panOnScroll,
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
}: FlowRendererProps) => {
  const nodesSelectionActive = useStore(selector);
  const selectionKeyPressed = useKeyPress(selectionKeyCode);
  const panActivationKeyPressed = useKeyPress(panActivationKeyCode);

  const panOnDrag = panActivationKeyPressed || _panOnDrag;
  const isSelecting = selectionKeyPressed || (selectionOnDrag && panOnDrag !== true);

  useGlobalKeyHandler({ deleteKeyCode, multiSelectionKeyCode });

  return (
    <ZoomPane
      onMove={onMove}
      onMoveStart={onMoveStart}
      onMoveEnd={onMoveEnd}
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
};

FlowRenderer.displayName = 'FlowRenderer';

export default memo(FlowRenderer);

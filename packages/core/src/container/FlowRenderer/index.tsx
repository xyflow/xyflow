import { memo } from 'react';
import type { ReactNode, WheelEvent, MouseEvent } from 'react';

import { useStore, useStoreApi } from '../../hooks/useStore';
import useGlobalKeyHandler from '../../hooks/useGlobalKeyHandler';
import useKeyPress from '../../hooks/useKeyPress';
import { GraphViewProps } from '../GraphView';
import ZoomPane from '../ZoomPane';
import UserSelection from '../../components/UserSelection';
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
  selectBoxOnDrag,
  selectBoxMode,
  onSelectionStart,
  onSelectionEnd,
  multiSelectionKeyCode,
  zoomActivationKeyCode,
  elementsSelectable,
  zoomOnScroll,
  zoomOnPinch,
  panOnScroll,
  panOnScrollSpeed,
  panOnScrollMode,
  zoomOnDoubleClick,
  panOnDrag,
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
  const store = useStoreApi();
  const nodesSelectionActive = useStore(selector);
  const selectionKeyPressed = useKeyPress(selectionKeyCode);

  const isSelectionMode = selectionKeyPressed || (selectBoxOnDrag && panOnDrag !== true);

  useGlobalKeyHandler({ deleteKeyCode, multiSelectionKeyCode });

  const onClick = (event: MouseEvent) => {
    onPaneClick?.(event);
    store.getState().resetSelectedElements();
    store.setState({ nodesSelectionActive: false });
  };

  const onContextMenu = (event: MouseEvent) => {
    if (panOnDrag === 'RightClick') {
      event.preventDefault();
    } else {
      onPaneContextMenu?.(event);
    }
  };
  const onWheel = onPaneScroll ? (event: WheelEvent) => onPaneScroll(event) : undefined;

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
      <UserSelection
        onSelectionStart={onSelectionStart}
        onSelectionEnd={onSelectionEnd}
        onClick={onClick}
        onMouseEnter={onPaneMouseEnter}
        onMouseMove={onPaneMouseMove}
        onMouseLeave={onPaneMouseLeave}
        onContextMenu={onContextMenu}
        onWheel={onWheel}
        isSelectionMode={isSelectionMode}
        selectBoxMode={selectBoxMode}
      >
        {children}
        {nodesSelectionActive && (
          <NodesSelection
            onSelectionContextMenu={onSelectionContextMenu}
            noPanClassName={noPanClassName}
            disableKeyboardA11y={disableKeyboardA11y}
          />
        )}
      </UserSelection>
    </ZoomPane>
  );
};

FlowRenderer.displayName = 'FlowRenderer';

export default memo(FlowRenderer);

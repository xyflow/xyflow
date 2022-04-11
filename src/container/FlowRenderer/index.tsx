import React, { useCallback, memo, ReactNode, WheelEvent, MouseEvent } from 'react';
import shallow from 'zustand/shallow';

import { useStore, useStoreApi } from '../../store';
import useGlobalKeyHandler from '../../hooks/useGlobalKeyHandler';
import useKeyPress from '../../hooks/useKeyPress';
import { GraphViewProps } from '../GraphView';
import ZoomPane from '../ZoomPane';
import UserSelection from '../../components/UserSelection';
import NodesSelection from '../../components/NodesSelection';
import { ReactFlowState } from '../../types';

interface FlowRendererProps
  extends Omit<
    GraphViewProps,
    | 'snapToGrid'
    | 'nodeTypes'
    | 'edgeTypes'
    | 'snapGrid'
    | 'connectionLineType'
    | 'arrowHeadColor'
    | 'onlyRenderVisibleElements'
    | 'selectNodesOnDrag'
    | 'defaultMarkerColor'
  > {
  children: ReactNode;
}

const selector = (s: ReactFlowState) => ({
  resetSelectedElements: s.resetSelectedElements,
  nodesSelectionActive: s.nodesSelectionActive,
});

const FlowRenderer = ({
  children,
  onPaneClick,
  onPaneContextMenu,
  onPaneScroll,
  deleteKeyCode,
  onMove,
  onMoveStart,
  onMoveEnd,
  selectionKeyCode,
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
  defaultPosition,
  defaultZoom,
  preventScrolling,
  onSelectionDragStart,
  onSelectionDrag,
  onSelectionDragStop,
  onSelectionContextMenu,
  noWheelClassName,
  noPanClassName,
}: FlowRendererProps) => {
  const store = useStoreApi();
  const { resetSelectedElements, nodesSelectionActive } = useStore(selector, shallow);
  const selectionKeyPressed = useKeyPress(selectionKeyCode);

  useGlobalKeyHandler({ deleteKeyCode, multiSelectionKeyCode });

  const onClick = useCallback(
    (event: MouseEvent) => {
      onPaneClick?.(event);
      resetSelectedElements();

      store.setState({ nodesSelectionActive: false });
    },
    [onPaneClick]
  );

  const onContextMenu = useCallback((event: MouseEvent) => onPaneContextMenu?.(event), [onPaneContextMenu]);
  const onWheel = useCallback((event: WheelEvent) => onPaneScroll?.(event), [onPaneScroll]);

  return (
    <ZoomPane
      onMove={onMove}
      onMoveStart={onMoveStart}
      onMoveEnd={onMoveEnd}
      selectionKeyPressed={selectionKeyPressed}
      elementsSelectable={elementsSelectable}
      zoomOnScroll={zoomOnScroll}
      zoomOnPinch={zoomOnPinch}
      panOnScroll={panOnScroll}
      panOnScrollSpeed={panOnScrollSpeed}
      panOnScrollMode={panOnScrollMode}
      zoomOnDoubleClick={zoomOnDoubleClick}
      panOnDrag={panOnDrag}
      defaultPosition={defaultPosition}
      defaultZoom={defaultZoom}
      zoomActivationKeyCode={zoomActivationKeyCode}
      preventScrolling={preventScrolling}
      noWheelClassName={noWheelClassName}
      noPanClassName={noPanClassName}
    >
      {children}
      <UserSelection selectionKeyPressed={selectionKeyPressed} />
      {nodesSelectionActive && (
        <NodesSelection
          onSelectionDragStart={onSelectionDragStart}
          onSelectionDrag={onSelectionDrag}
          onSelectionDragStop={onSelectionDragStop}
          onSelectionContextMenu={onSelectionContextMenu}
          noPanClassName={noPanClassName}
        />
      )}
      <div
        className="react-flow__pane react-flow__container"
        onClick={onClick}
        onContextMenu={onContextMenu}
        onWheel={onWheel}
      />
    </ZoomPane>
  );
};

FlowRenderer.displayName = 'FlowRenderer';

export default memo(FlowRenderer);

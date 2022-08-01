import React, { memo, ReactNode, WheelEvent, MouseEvent } from 'react';

import { useStore, useStoreApi } from '../../store';
import useGlobalKeyHandler from '../../hooks/useGlobalKeyHandler';
import useKeyPress from '../../hooks/useKeyPress';
import { GraphViewProps } from '../GraphView';
import ZoomPane from '../ZoomPane';
import UserSelection from '../../components/UserSelection';
import NodesSelection from '../../components/NodesSelection';

import { ReactFlowState } from '../../types';

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
  preventScrolling,
  onSelectionContextMenu,
  noWheelClassName,
  noPanClassName,
  disableKeyboardA11y,
}: FlowRendererProps) => {
  const store = useStoreApi();
  const nodesSelectionActive = useStore(selector);
  const selectionKeyPressed = useKeyPress(selectionKeyCode);

  useGlobalKeyHandler({ deleteKeyCode, multiSelectionKeyCode });

  const onClick = (event: MouseEvent) => {
    onPaneClick?.(event);
    store.getState().resetSelectedElements();
    store.setState({ nodesSelectionActive: false });
  };

  const onContextMenu = onPaneContextMenu ? (event: MouseEvent) => onPaneContextMenu(event) : undefined;
  const onWheel = onPaneScroll ? (event: WheelEvent) => onPaneScroll(event) : undefined;

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
      defaultViewport={defaultViewport}
      zoomActivationKeyCode={zoomActivationKeyCode}
      preventScrolling={preventScrolling}
      noWheelClassName={noWheelClassName}
      noPanClassName={noPanClassName}
    >
      {children}
      <UserSelection selectionKeyPressed={selectionKeyPressed} />
      {nodesSelectionActive && (
        <NodesSelection
          onSelectionContextMenu={onSelectionContextMenu}
          noPanClassName={noPanClassName}
          disableKeyboardA11y={disableKeyboardA11y}
        />
      )}
      <div
        className="react-flow__pane react-flow__container"
        onClick={onClick}
        onMouseEnter={onPaneMouseEnter}
        onMouseMove={onPaneMouseMove}
        onMouseLeave={onPaneMouseLeave}
        onContextMenu={onContextMenu}
        onWheel={onWheel}
      />
    </ZoomPane>
  );
};

FlowRenderer.displayName = 'FlowRenderer';

export default memo(FlowRenderer);

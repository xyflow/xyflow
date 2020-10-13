import React, { useCallback, useRef, memo, ReactNode, WheelEvent, MouseEvent } from 'react';
import { useStoreActions, useStoreState } from '../../store/hooks';

import useResizeHandler from '../../hooks/useResizeHandler';
import useGlobalKeyHandler from '../../hooks/useGlobalKeyHandler';
import useD3Zoom from '../../hooks/useD3Zoom';
import useKeyPress from '../../hooks/useKeyPress';

import { GraphViewProps } from '../GraphView';
import UserSelection from '../../components/UserSelection';
import NodesSelection from '../../components/NodesSelection';

interface FlowRendererProps
  extends Omit<
    GraphViewProps,
    | 'elements'
    | 'snapToGrid'
    | 'nodeTypes'
    | 'edgeTypes'
    | 'snapGrid'
    | 'connectionLineType'
    | 'arrowHeadColor'
    | 'onlyRenderVisibleNodes'
  > {
  children: ReactNode;
}

const FlowRenderer = ({
  children,
  onPaneClick,
  onPaneContextMenu,
  onPaneScroll,
  onElementsRemove,
  deleteKeyCode,
  onMove,
  onMoveStart,
  onMoveEnd,
  selectionKeyCode,
  zoomOnScroll,
  zoomOnDoubleClick,
  paneMoveable,
  defaultPosition,
  defaultZoom,
  translateExtent,
  onSelectionDragStart,
  onSelectionDrag,
  onSelectionDragStop,
  onSelectionContextMenu,
}: FlowRendererProps) => {
  const zoomPane = useRef<HTMLDivElement>(null);
  const unsetNodesSelection = useStoreActions((actions) => actions.unsetNodesSelection);
  const nodesSelectionActive = useStoreState((state) => state.nodesSelectionActive);
  const selectionKeyPressed = useKeyPress(selectionKeyCode);

  useResizeHandler(zoomPane);
  useGlobalKeyHandler({ onElementsRemove, deleteKeyCode });

  useD3Zoom({
    zoomPane,
    onMove,
    onMoveStart,
    onMoveEnd,
    selectionKeyPressed,
    zoomOnScroll,
    zoomOnDoubleClick,
    paneMoveable,
    defaultPosition,
    defaultZoom,
    translateExtent,
  });

  const onClick = useCallback(
    (event: MouseEvent) => {
      onPaneClick?.(event);
      unsetNodesSelection();
    },
    [onPaneClick]
  );

  const onContextMenu = useCallback(
    (event: MouseEvent) => {
      onPaneContextMenu?.(event);
    },
    [onPaneContextMenu]
  );

  const onWheel = useCallback(
    (event: WheelEvent) => {
      onPaneScroll?.(event);
    },
    [onPaneScroll]
  );

  return (
    <div className="react-flow__renderer" ref={zoomPane}>
      {children}
      <UserSelection selectionKeyPressed={selectionKeyPressed} />
      {nodesSelectionActive && (
        <NodesSelection
          onSelectionDragStart={onSelectionDragStart}
          onSelectionDrag={onSelectionDrag}
          onSelectionDragStop={onSelectionDragStop}
          onSelectionContextMenu={onSelectionContextMenu}
        />
      )}
      <div className="react-flow__pane" onClick={onClick} onContextMenu={onContextMenu} onWheel={onWheel} />
    </div>
  );
};

FlowRenderer.displayName = 'FlowRenderer';

export default memo(FlowRenderer);

import { useCallback, useEffect, useRef, useState } from 'react';
import { XYPanZoom, PanOnScrollMode, type Transform, type PanZoomInstance } from '@xyflow/system';

import { useKeyPress } from '../../hooks/useKeyPress';
import { useResizeHandler } from '../../hooks/useResizeHandler';
import { useReactFlowStore, useConnectionStore, useReactFlowStoreApi } from '../../hooks/useReactFlowStore';
import { containerStyle } from '../../styles/utils';
import type { FlowRendererProps } from '../FlowRenderer';

type ZoomPaneProps = Omit<
  FlowRendererProps,
  'deleteKeyCode' | 'selectionKeyCode' | 'multiSelectionKeyCode' | 'noDragClassName' | 'disableKeyboardA11y'
> & {
  isControlledViewport: boolean;
  panActivationKeyPressed: boolean;
};

export function ZoomPane({
  onPaneContextMenu,
  zoomOnScroll = true,
  zoomOnPinch = true,
  panOnScroll = false,
  panActivationKeyPressed,
  panOnScrollSpeed = 0.5,
  panOnScrollMode = PanOnScrollMode.Free,
  zoomOnDoubleClick = true,
  panOnDrag = true,
  defaultViewport,
  translateExtent,
  minZoom,
  maxZoom,
  zoomActivationKeyCode,
  preventScrolling = true,
  children,
  noWheelClassName,
  noPanClassName,
  onViewportChange,
  isControlledViewport,
  paneClickDistance,
  selectionOnDrag,
}: ZoomPaneProps) {
  const { store, viewportStore } = useReactFlowStoreApi();
  const userSelectionActive = useReactFlowStore((s) => s.userSelectionActive);
  const connectionInProgress = useConnectionStore((state) => state.connection.inProgress);
  const zoomActivationKeyPressed = useKeyPress(zoomActivationKeyCode);

  const zoomPane = useRef<HTMLDivElement>(null);
  const panZoom = useRef<PanZoomInstance>();
  // We want to prevent re-initialization of the pan/zoom instance
  const [panZoomOptions] = useState(() => ({
    minZoom,
    maxZoom,
    translateExtent,
    defaultViewport,
  }));

  useResizeHandler(zoomPane);

  const onTransformChange = useCallback(
    (transform: Transform) => {
      onViewportChange?.({ x: transform[0], y: transform[1], zoom: transform[2] });

      if (!isControlledViewport) {
        viewportStore.setState({ transform });
      }
    },
    [onViewportChange, isControlledViewport, viewportStore]
  );

  useEffect(() => {
    if (zoomPane.current) {
      panZoom.current = XYPanZoom({
        domNode: zoomPane.current,
        minZoom: panZoomOptions.minZoom,
        maxZoom: panZoomOptions.maxZoom,
        translateExtent: panZoomOptions.translateExtent,
        viewport: panZoomOptions.defaultViewport,
        onDraggingChange: (paneDragging) =>
          viewportStore.setState((prevState) =>
            prevState.paneDragging === paneDragging ? prevState : { paneDragging }
          ),
        onPanZoomStart: (event, vp) => {
          const { onViewportChangeStart, onMoveStart } = store.getState();
          onMoveStart?.(event, vp);
          onViewportChangeStart?.(vp);
        },
        onPanZoom: (event, vp) => {
          const { onViewportChange, onMove } = store.getState();
          onMove?.(event, vp);
          onViewportChange?.(vp);
        },
        onPanZoomEnd: (event, vp) => {
          const { onViewportChangeEnd, onMoveEnd } = store.getState();
          onMoveEnd?.(event, vp);
          onViewportChangeEnd?.(vp);
        },
      });

      const { x, y, zoom } = panZoom.current.getViewport();

      store.setState({ panZoom: panZoom.current, domNode: zoomPane.current.closest('.react-flow') as HTMLDivElement });
      viewportStore.setState({ transform: [x, y, zoom] });

      return () => {
        panZoom.current?.destroy();
      };
    }
  }, [panZoomOptions, store, viewportStore]);

  useEffect(() => {
    panZoom.current?.update({
      onPaneContextMenu,
      zoomOnScroll,
      zoomOnPinch,
      panOnScroll,
      panActivationKeyPressed,
      panOnScrollSpeed,
      panOnScrollMode,
      zoomOnDoubleClick,
      panOnDrag,
      zoomActivationKeyPressed,
      preventScrolling,
      noPanClassName,
      userSelectionActive,
      noWheelClassName,
      lib: 'react',
      onTransformChange,
      connectionInProgress,
      selectionOnDrag,
      paneClickDistance,
    });
  }, [
    onPaneContextMenu,
    zoomOnScroll,
    zoomOnPinch,
    panOnScroll,
    panActivationKeyPressed,
    panOnScrollSpeed,
    panOnScrollMode,
    zoomOnDoubleClick,
    panOnDrag,
    zoomActivationKeyPressed,
    preventScrolling,
    noPanClassName,
    userSelectionActive,
    noWheelClassName,
    onTransformChange,
    connectionInProgress,
    selectionOnDrag,
    paneClickDistance,
  ]);

  return (
    <div className="react-flow__renderer" ref={zoomPane} style={containerStyle}>
      {children}
    </div>
  );
}

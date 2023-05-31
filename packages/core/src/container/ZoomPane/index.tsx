/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef } from 'react';
import { shallow } from 'zustand/shallow';
import { XYPanZoom } from '@reactflow/utils';
import { PanOnScrollMode, type Transform, type PanZoomInstance, OnPanZoom } from '@reactflow/system';

import useKeyPress from '../../hooks/useKeyPress';
import useResizeHandler from '../../hooks/useResizeHandler';
import { useStore, useStoreApi } from '../../hooks/useStore';
import { containerStyle } from '../../styles';
import type { FlowRendererProps } from '../FlowRenderer';
import type { ReactFlowState } from '../../types';

type ZoomPaneProps = Omit<
  FlowRendererProps,
  | 'deleteKeyCode'
  | 'selectionKeyCode'
  | 'multiSelectionKeyCode'
  | 'noDragClassName'
  | 'disableKeyboardA11y'
  | 'selectionOnDrag'
>;

const selector = (s: ReactFlowState) => ({
  userSelectionActive: s.userSelectionActive,
  onViewportChangeStart: s.onViewportChangeStart,
  onViewportChange: s.onViewportChange,
  onViewportChangeEnd: s.onViewportChangeEnd,
});

const ZoomPane = ({
  onMove,
  onMoveStart,
  onMoveEnd,
  onPaneContextMenu,
  zoomOnScroll = true,
  zoomOnPinch = true,
  panOnScroll = false,
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
}: ZoomPaneProps) => {
  const store = useStoreApi();
  const zoomPane = useRef<HTMLDivElement>(null);
  const { userSelectionActive, onViewportChangeStart, onViewportChange, onViewportChangeEnd } = useStore(
    selector,
    shallow
  );
  const zoomActivationKeyPressed = useKeyPress(zoomActivationKeyCode);
  const panZoom = useRef<PanZoomInstance>();

  useResizeHandler(zoomPane);

  useEffect(() => {
    if (zoomPane.current) {
      panZoom.current = XYPanZoom({
        domNode: zoomPane.current,
        minZoom,
        maxZoom,
        translateExtent,
        viewport: defaultViewport,
        onTransformChange: (transform: Transform) => store.setState({ transform }),
        onDraggingChange: (paneDragging: boolean) => store.setState({ paneDragging }),
      });

      const { x, y, zoom } = panZoom.current.getViewport();

      store.setState({
        panZoom: panZoom.current,
        transform: [x, y, zoom],
        domNode: zoomPane.current.closest('.react-flow') as HTMLDivElement,
      });
    }
  }, []);

  const onPanZoomStart: OnPanZoom = useCallback(
    (event, vp) => {
      onMoveStart?.(event, vp);
      onViewportChangeStart?.(vp);
    },
    [onMoveStart, onViewportChangeStart]
  );

  const onPanZoom: OnPanZoom = useCallback(
    (event, vp) => {
      onMove?.(event, vp);
      onViewportChange?.(vp);
    },
    [onMove, onViewportChange]
  );

  const onPanZoomEnd: OnPanZoom = useCallback(
    (event, vp) => {
      onMoveEnd?.(event, vp);
      onViewportChangeEnd?.(vp);
    },
    [onMoveEnd, onViewportChangeEnd]
  );

  useEffect(() => {
    panZoom.current?.update({
      onPanZoomStart,
      onPanZoom,
      onPanZoomEnd,
      onPaneContextMenu,
      zoomOnScroll,
      zoomOnPinch,
      panOnScroll,
      panOnScrollSpeed,
      panOnScrollMode,
      zoomOnDoubleClick,
      panOnDrag,
      zoomActivationKeyPressed,
      preventScrolling,
      noPanClassName,
      userSelectionActive,
      noWheelClassName,
    });
  }, [
    onPanZoomStart,
    onPanZoom,
    onPanZoomEnd,
    onPaneContextMenu,
    zoomOnScroll,
    zoomOnPinch,
    panOnScroll,
    panOnScrollSpeed,
    panOnScrollMode,
    zoomOnDoubleClick,
    panOnDrag,
    zoomActivationKeyPressed,
    preventScrolling,
    noPanClassName,
    userSelectionActive,
    noWheelClassName,
  ]);

  return (
    <div className="react-flow__renderer" ref={zoomPane} style={containerStyle}>
      {children}
    </div>
  );
};

export default ZoomPane;

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef } from 'react';
import { PanZoom } from '@reactflow/utils';
import {
  PanOnScrollMode,
  type Transform,
  type PanZoomInstance,
  Viewport,
  OnMoveStart,
  OnMove,
  OnMoveEnd,
} from '@reactflow/system';

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

const selector = (s: ReactFlowState) => s.userSelectionActive;

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
  const userSelectionActive = useStore(selector);
  const zoomActivationKeyPressed = useKeyPress(zoomActivationKeyCode);
  const panZoom = useRef<PanZoomInstance>(PanZoom());

  useResizeHandler(zoomPane);

  useEffect(() => {
    if (zoomPane.current) {
      const { transform } = panZoom.current.init({
        domNode: zoomPane.current,
        minZoom,
        maxZoom,
        translateExtent,
        viewport: defaultViewport,
        onTransformChange: (transform: Transform) => store.setState({ transform }),
        onDraggingChange: (paneDragging: boolean) => store.setState({ paneDragging }),
      });

      store.setState({
        panZoom: panZoom.current,
        transform,
        domNode: zoomPane.current.closest('.react-flow') as HTMLDivElement,
      });
    }
  }, []);

  const onPanZoomStart: OnMoveStart = useCallback(
    (event, vp) => {
      onMoveStart?.(event, vp);
      store.getState().onViewportChangeStart?.(vp);
    },
    [onMoveStart]
  );

  const onPanZoom: OnMove = useCallback(
    (event, vp) => {
      onMove?.(event, vp);
      store.getState().onViewportChange?.(vp);
    },
    [onMove]
  );

  const onPanZoomEnd: OnMoveEnd = useCallback(
    (event, vp) => {
      onMoveEnd?.(event, vp);
      store.getState().onViewportChangeEnd?.(vp);
    },
    [onMoveEnd]
  );

  useEffect(() => {
    panZoom.current.update({
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

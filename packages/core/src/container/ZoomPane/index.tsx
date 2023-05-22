/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from 'react';
import { shallow } from 'zustand/shallow';
import {
  initPanZoom,
  createPanOnScrollHandler,
  createZoomOnScrollHandler,
  createFilter,
  createPanZoomStartHandler,
  ZoomPanValues,
  createPanZoomHandler,
  createPanZoomEndHandler,
} from '@reactflow/utils';
import { PanOnScrollMode, Transform } from '@reactflow/system';

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
  d3Zoom: s.d3Zoom,
  d3Selection: s.d3Selection,
  d3ZoomHandler: s.d3ZoomHandler,
  userSelectionActive: s.userSelectionActive,
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
  elementsSelectable,
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
  const { d3Zoom, d3Selection, d3ZoomHandler, userSelectionActive } = useStore(selector, shallow);
  const zoomActivationKeyPressed = useKeyPress(zoomActivationKeyCode);

  const zoomPanValues = useRef<ZoomPanValues>({
    isZoomingOrPanning: false,
    zoomedWithRightMouseButton: false,
    prevTransform: { x: 0, y: 0, zoom: 0 },
    mouseButton: 0,
    timerId: undefined,
  });

  useResizeHandler(zoomPane);

  useEffect(() => {
    if (zoomPane.current) {
      const { d3ZoomInstance, d3Selection, d3ZoomHandler, transform } = initPanZoom({
        domNode: zoomPane.current,
        minZoom,
        maxZoom,
        translateExtent,
        defaultViewport,
      });

      store.setState({
        d3Zoom: d3ZoomInstance,
        d3Selection,
        d3ZoomHandler,
        transform,
        domNode: zoomPane.current.closest('.react-flow') as HTMLDivElement,
      });
    }
  }, []);

  useEffect(() => {
    if (d3Selection && d3Zoom) {
      if (panOnScroll && !zoomActivationKeyPressed && !userSelectionActive) {
        const panOnScrollHandler = createPanOnScrollHandler({
          noWheelClassName,
          d3Selection,
          d3Zoom,
          panOnScrollMode,
          panOnScrollSpeed,
          zoomOnPinch,
        });
        d3Selection.on('wheel.zoom', panOnScrollHandler, { passive: false });
      } else if (d3ZoomHandler !== null) {
        const zoomOnScrollHandler = createZoomOnScrollHandler({
          noWheelClassName,
          preventScrolling,
          d3ZoomHandler,
        });
        d3Selection.on('wheel.zoom', zoomOnScrollHandler, { passive: false });
      }
    }
  }, [
    userSelectionActive,
    panOnScroll,
    panOnScrollMode,
    d3Selection,
    d3Zoom,
    d3ZoomHandler,
    zoomActivationKeyPressed,
    zoomOnPinch,
    preventScrolling,
    noWheelClassName,
  ]);

  useEffect(() => {
    if (d3Zoom) {
      const startHandler = createPanZoomStartHandler({
        zoomPanValues: zoomPanValues.current,
        setDragging: (paneDragging: boolean) => store.setState({ paneDragging }),
        onMoveStart,
        onViewportChangeStart: store.getState().onViewportChangeStart,
      });
      d3Zoom.on('start', startHandler);
    }
  }, [d3Zoom, onMoveStart]);

  useEffect(() => {
    if (d3Zoom) {
      if (userSelectionActive && !zoomPanValues.current.isZoomingOrPanning) {
        d3Zoom.on('zoom', null);
      } else if (!userSelectionActive) {
        const panZoomHandler = createPanZoomHandler({
          zoomPanValues: zoomPanValues.current,
          panOnDrag,
          onPaneContextMenu: !!onPaneContextMenu,
          onMove,
          onViewportChange: store.getState().onViewportChange,
          setTransform: (transform: Transform) => store.setState({ transform }),
        });
        d3Zoom.on('zoom', panZoomHandler);
      }
    }
  }, [userSelectionActive, d3Zoom, onMove, panOnDrag, onPaneContextMenu]);

  useEffect(() => {
    if (d3Zoom) {
      const panZoomEndHandler = createPanZoomEndHandler({
        zoomPanValues: zoomPanValues.current,
        panOnDrag,
        panOnScroll,
        onPaneContextMenu,
        onMoveEnd,
        onViewportChangeEnd: store.getState().onViewportChangeEnd,
        setDragging: (paneDragging: boolean) => store.setState({ paneDragging }),
      });
      d3Zoom.on('end', panZoomEndHandler);
    }
  }, [d3Zoom, panOnScroll, panOnDrag, onMoveEnd, onPaneContextMenu]);

  useEffect(() => {
    if (d3Zoom) {
      const filter = createFilter({
        zoomActivationKeyPressed,
        panOnDrag,
        zoomOnScroll,
        panOnScroll,
        zoomOnDoubleClick,
        zoomOnPinch,
        userSelectionActive,
        noPanClassName,
        noWheelClassName,
      });
      d3Zoom.filter(filter);
    }
  }, [
    userSelectionActive,
    d3Zoom,
    zoomOnScroll,
    zoomOnPinch,
    panOnScroll,
    zoomOnDoubleClick,
    panOnDrag,
    elementsSelectable,
    zoomActivationKeyPressed,
  ]);

  return (
    <div className="react-flow__renderer" ref={zoomPane} style={containerStyle}>
      {children}
    </div>
  );
};

export default ZoomPane;

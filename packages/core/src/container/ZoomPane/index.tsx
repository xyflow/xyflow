/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from 'react';
import { shallow } from 'zustand/shallow';
import { XYPanZoom } from '@reactflow/utils';
import { PanOnScrollMode, type Transform, type PanZoomInstance } from '@reactflow/system';

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
  const { userSelectionActive } = useStore(selector, shallow);
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

      store.setState({
        panZoom: panZoom.current,
        transform: [x, y, zoom],
        domNode: zoomPane.current.closest('.react-flow') as HTMLDivElement,
      });

      return () => {
        panZoom.current?.destroy();
      };
    }
  }, []);

  useEffect(() => {
    panZoom.current?.update({
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

/* eslint-disable @typescript-eslint/no-explicit-any */
import { XYPanZoom, PanOnScrollMode, type Transform, type PanZoomInstance } from '@xyflow/system';

import { useKeyPress } from '../../hooks/useKeyPress';
import { useResizeHandler } from '../../hooks/useResizeHandler';
import { useStore, useStoreApi } from '../../hooks/useStore';
import { containerStyle } from '../../styles/utils';
import type { FlowRendererProps } from '../FlowRenderer';
import type { SolidFlowState } from '../../types';
import { createEffect, createSignal, mergeProps, onCleanup } from 'solid-js';
import { useRef } from '../../utils/hooks';

type ZoomPaneProps = Omit<
  FlowRendererProps,
  | 'deleteKeyCode'
  | 'selectionKeyCode'
  | 'multiSelectionKeyCode'
  | 'noDragClassName'
  | 'disableKeyboardA11y'
  | 'selectionOnDrag'
> & {
  isControlledViewport: boolean;
};

const selector = (s: SolidFlowState) => ({
  userSelectionActive: s.userSelectionActive,
  lib: s.lib,
});

export function ZoomPane(_p: ZoomPaneProps) {
//   onPaneContextMenu,
//   zoomOnScroll = true,
//   zoomOnPinch = true,
//   panOnScroll = false,
//   panOnScrollSpeed = 0.5,
//   panOnScrollMode = PanOnScrollMode.Free,
//   zoomOnDoubleClick = true,
//   panOnDrag = true,
//   defaultViewport,
//   translateExtent,
//   minZoom,
//   maxZoom,
//   zoomActivationKeyCode,
//   preventScrolling = true,
//   children,
//   noWheelClassName,
//   noPanClassName,
//   onViewportChange,
//   isControlledViewport,
// }: ZoomPaneProps) {

const p = mergeProps({
zoomOnScroll: true,
zoomOnPinch: true,
panOnScroll: false,
panOnScrollSpeed: 0.5,
panOnScrollMode: PanOnScrollMode.Free,
zoomOnDoubleClick: true,
panOnDrag: true,
preventScrolling: true,
} satisfies Partial<ZoomPaneProps>
, _p);

  const store = useStoreApi();
  const [getZoomPane, setZoomPane] = createSignal<HTMLDivElement| null>(null);
  const { userSelectionActive, lib } = useStore(selector);
  const zoomActivationKeyPressed = useKeyPress(() => (p.zoomActivationKeyCode ?? null));
  const panZoom = useRef<PanZoomInstance | null>(null);

  useResizeHandler(getZoomPane);

  createEffect(() => {
    const zoomPane = getZoomPane();
    if (zoomPane) {
      panZoom.current = XYPanZoom({
        domNode: zoomPane,
        minZoom: p.minZoom,
        maxZoom: p.maxZoom,
        translateExtent: p.translateExtent,
        viewport: p.defaultViewport,
        onTransformChange: (transform: Transform) => {
          p.onViewportChange?.({ x: transform[0], y: transform[1], zoom: transform[2] });

          if (!p.isControlledViewport) {
            store.transform.set(transform);
          }
        },
        onDraggingChange: (paneDragging: boolean) => store.paneDragging.set(paneDragging),
        onPanZoomStart: (event, vp) => {
          console.log("onPanZoomStart", event, vp);
          const { onViewportChangeStart, onMoveStart } = store;
          onMoveStart?.(event, vp);
          onViewportChangeStart.get()?.(vp);
        },
        onPanZoom: (event, vp) => {
          const { onViewportChange, onMove } = store;
          onMove?.(event, vp);
          onViewportChange.get()?.(vp);
        },
        onPanZoomEnd: (event, vp) => {
          const { onViewportChangeEnd, onMoveEnd } = store;
          onMoveEnd?.(event, vp);
          onViewportChangeEnd.get()?.(vp);
        },
      });

      const { x, y, zoom } = panZoom.current!.getViewport();

      store.batch((store) => {
        store.panZoom.set(panZoom.current);
        store.transform.set([x, y, zoom]);
        store.domNode.set(zoomPane.closest('.react-flow') as HTMLDivElement);
      });

      onCleanup(() => {
        panZoom.current?.destroy();
      });
    }
  });

  createEffect(() => {
    console.log("panOnDrag", p.panOnDrag);
    panZoom.current?.update({
      onPaneContextMenu: p.onPaneContextMenu,
      zoomOnScroll: p.zoomOnScroll,
      zoomOnPinch: p.zoomOnPinch,
      panOnScroll: p.panOnScroll,
      panOnScrollSpeed: p.panOnScrollSpeed,
      panOnScrollMode: p.panOnScrollMode,
      zoomOnDoubleClick: p.zoomOnDoubleClick,
      panOnDrag: p.panOnDrag,
      zoomActivationKeyPressed: zoomActivationKeyPressed(),
      preventScrolling: p.preventScrolling,
      noPanClassName: p.noPanClassName,
      userSelectionActive: userSelectionActive.get(),
      noWheelClassName: p.noWheelClassName,
      lib: lib.get(),
    });
  })

  return (
    <div class="react-flow__renderer" ref={setZoomPane} style={containerStyle}>
      {p.children}
    </div>
  );
}

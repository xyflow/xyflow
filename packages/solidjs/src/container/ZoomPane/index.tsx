/* eslint-disable @typescript-eslint/no-explicit-any */
import { XYPanZoom, PanOnScrollMode, type Transform, type PanZoomInstance } from '@xyflow/system';

import { useKeyPress } from '../../hooks/useKeyPress';
import { useResizeHandler } from '../../hooks/useResizeHandler';
import { useStore, useStoreApi } from '../../hooks/useStore';
import { containerStyle } from '../../styles/utils';
import type { FlowRendererProps } from '../FlowRenderer';
import type { SolidFlowState } from '../../types';
import { createEffect, mergeProps, onCleanup } from 'solid-js';

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
  userSelectionActive: () => s.userSelectionActive.get(),
  lib: () => s.lib.get(),
});

export function ZoomPane(_p: ZoomPaneProps) {
  const p = mergeProps(
    {
      zoomOnScroll: true,
      zoomOnPinch: true,
      panOnScroll: false,
      panOnScrollSpeed: 0.5,
      panOnScrollMode: PanOnScrollMode.Free,
      zoomOnDoubleClick: true,
      panOnDrag: true,
      preventScrolling: true,
    } satisfies Partial<ZoomPaneProps>,
    _p
  );

  const store = useStoreApi();
  let zoomPane: HTMLDivElement | null = null;
  const storeData = useStore(selector);
  const zoomActivationKeyPressed = useKeyPress(() => p.zoomActivationKeyCode ?? null);
  let panZoom: PanZoomInstance | null = null;

  useResizeHandler(() => zoomPane);

  const onTransformChange = (transform: Transform) => {
    p.onViewportChange?.({ x: transform[0], y: transform[1], zoom: transform[2] });

    if (!p.isControlledViewport) {
      store.transform.set(transform);
    }
  };

  createEffect(() => {
    if (zoomPane) {
      panZoom = XYPanZoom({
        domNode: zoomPane,
        minZoom: p.minZoom,
        maxZoom: p.maxZoom,
        translateExtent: p.translateExtent,
        viewport: p.defaultViewport,
        paneClickDistance: p.paneClickDistance ?? 0,
        onDraggingChange: (paneDragging: boolean) => store.paneDragging.set(paneDragging),
        onPanZoomStart: (event, vp) => {
          const { onViewportChangeStart, onMoveStart } = store;
          onMoveStart.get()?.(event, vp);
          onViewportChangeStart.get()?.(vp);
        },
        onPanZoom: (event, vp) => {
          const { onViewportChange, onMove } = store;
          onMove.get()?.(event, vp);
          onViewportChange.get()?.(vp);
        },
        onPanZoomEnd: (event, vp) => {
          const { onViewportChangeEnd, onMoveEnd } = store;
          onMoveEnd.get()?.(event, vp);
          onViewportChangeEnd.get()?.(vp);
        },
      });

      const { x, y, zoom } = panZoom.getViewport();

      store.batch((store) => {
        store.panZoom.set(panZoom);
        store.transform.set([x, y, zoom]);
        store.domNode.set(zoomPane?.closest('.react-flow') as HTMLDivElement);
      });

      onCleanup(() => {
        panZoom?.destroy();
      });
    }
  });

  createEffect(() => {
    panZoom?.update({
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
      userSelectionActive: storeData.userSelectionActive(),
      noWheelClassName: p.noWheelClassName,
      lib: storeData.lib(),
      onTransformChange,
    });
  });

  return (
    <div class="react-flow__renderer" ref={(el) => (zoomPane = el)} style={containerStyle}>
      {p.children}
    </div>
  );
}

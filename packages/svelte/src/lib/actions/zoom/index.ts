import type { Writable } from 'svelte/store';
import {
  PanOnScrollMode,
  XYPanZoom,
  type CoordinateExtent,
  type OnPanZoom,
  type PanZoomInstance,
  type Viewport
} from '@xyflow/system';
import type { SvelteFlowStore } from '$lib/store/types';

type ZoomParams = {
  store: SvelteFlowStore;
  initialViewport: Viewport;
  minZoom: number;
  maxZoom: number;
  onPanZoomStart?: OnPanZoom;
  onPanZoom?: OnPanZoom;
  onPanZoomEnd?: OnPanZoom;
  onPaneContextMenu?: (event: MouseEvent) => void;
  translateExtent: CoordinateExtent;
  zoomOnScroll: boolean;
  zoomOnPinch: boolean;
  zoomOnDoubleClick: boolean;
  panOnScroll: boolean;
  panOnDrag: boolean | number[];
  panOnScrollSpeed: number;
  panOnScrollMode: PanOnScrollMode;
  zoomActivationKeyPressed: boolean;
  preventScrolling: boolean;
  // last two instances of 'classname' being used
  // changing it to class would require object restructuring for use with panZoomInstance.update
  noPanClassName: string;
  noWheelClassName: string;
  userSelectionActive: boolean;
  lib: string;
};

export default function zoom(domNode: Element, params: ZoomParams) {
  const { store, minZoom, maxZoom, initialViewport, translateExtent } = params;

  const panZoomInstance = XYPanZoom({
    domNode,
    minZoom,
    maxZoom,
    translateExtent,
    viewport: initialViewport,
    onTransformChange: (transform) =>
      (store.viewport = { x: transform[0], y: transform[1], zoom: transform[2] }),
    onDraggingChange: (newDragging) => {
      store.dragging = newDragging;
    }
  });
  const currentViewport = panZoomInstance.getViewport();
  store.viewport = currentViewport;
  store.panZoom = panZoomInstance;

  panZoomInstance.update(params);

  return {
    update(params: ZoomParams) {
      panZoomInstance.update(params);
    }
  };
}

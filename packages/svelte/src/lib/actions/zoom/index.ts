/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Writable } from 'svelte/store';
import type {
  CoordinateExtent,
  OnPanZoom,
  PanOnScrollMode,
  PanZoomInstance,
  Transform,
  Viewport
} from '@reactflow/system';
import { XYPanZoom } from '@reactflow/utils';

type ZoomParams = {
  transform: Writable<Transform>;
  minZoom: number;
  maxZoom: number;
  initialViewport: Viewport;
  dragging: Writable<boolean>;
  onPanZoomStart?: OnPanZoom;
  onPanZoom?: OnPanZoom;
  onPanZoomEnd?: OnPanZoom;
  onPaneContextMenu?: (event: MouseEvent) => void;
  translateExtent: CoordinateExtent;
  panZoom: Writable<PanZoomInstance | null>;
  zoomOnScroll: boolean;
  zoomOnPinch: boolean;
  zoomOnDoubleClick: boolean;
  panOnScroll: boolean;
  panOnDrag: boolean | number[];
  panOnScrollSpeed: number;
  panOnScrollMode: PanOnScrollMode;
  zoomActivationKeyPressed: boolean;
  preventScrolling: boolean;
  noPanClassName: string;
  noWheelClassName: string;
  userSelectionActive: boolean;
};

export default function zoom(domNode: Element, params: ZoomParams) {
  const { panZoom, minZoom, maxZoom, initialViewport, transform, dragging, translateExtent } =
    params;

  const panZoomInstance = XYPanZoom({
    domNode,
    minZoom,
    maxZoom,
    translateExtent,
    viewport: initialViewport,
    onTransformChange: transform.set,
    onDraggingChange: dragging.set
  });
  const { x, y, zoom } = panZoomInstance.getViewport();
  transform.set([x, y, zoom]);
  panZoom.set(panZoomInstance);

  panZoomInstance.update(params);

  return {
    update(params: ZoomParams) {
      panZoomInstance.update(params);
    }
  };
}

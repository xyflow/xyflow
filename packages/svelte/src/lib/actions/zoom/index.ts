import type { Writable } from 'svelte/store';
import {
  PanOnScrollMode,
  XYPanZoom,
  type CoordinateExtent,
  type OnPanZoom,
  type PanZoomInstance,
  type Transform,
  type Viewport
} from '@xyflow/system';

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
  // last two instances of 'classname' being used
  // changing it to class would require object restructuring for use with panZoomInstance.update
  noPanClassName: string;
  noWheelClassName: string;
  userSelectionActive: boolean;
  lib: string;
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

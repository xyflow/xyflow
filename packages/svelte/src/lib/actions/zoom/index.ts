/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Writable } from 'svelte/store';
import type {
  CoordinateExtent,
  OnMove,
  OnMoveEnd,
  OnMoveStart,
  PanOnScrollMode,
  PanZoomInstance,
  Transform,
  Viewport
} from '@reactflow/system';
import { PanZoom } from '@reactflow/utils';

type ZoomParams = {
  transform: Writable<Transform>;
  minZoom: number;
  maxZoom: number;
  initialViewport: Viewport;
  dragging: Writable<boolean>;
  onMoveStart?: OnMoveStart;
  onMove?: OnMove;
  onMoveEnd?: OnMoveEnd;
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
  elementsSelectable: boolean;
  zoomActivationKeyPressed: boolean;
  preventScrolling: boolean;
  noPanClassName: string;
  noWheelClassName: string;
  userSelectionActive: boolean;
};

export default function zoom(domNode: Element, params: ZoomParams) {
  const { panZoom, minZoom, maxZoom, initialViewport, transform, dragging, translateExtent } =
    params;

  const panZoomInstance = PanZoom();
  const { transform: nextTransform } = panZoomInstance.init({
    domNode,
    minZoom,
    maxZoom,
    translateExtent,
    viewport: initialViewport,
    onTransformChange: transform.set,
    onDraggingChange: dragging.set
  });

  transform.set(nextTransform);
  panZoom.set(panZoomInstance);

  panZoomInstance.update(params);

  return {
    update(params: ZoomParams) {
      panZoomInstance.update(params);
    }
  };
}

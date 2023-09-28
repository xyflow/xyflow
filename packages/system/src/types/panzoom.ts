import type { ZoomTransform } from 'd3-zoom';

import { PanOnScrollMode, type CoordinateExtent, type Transform, type Viewport } from './';

export type OnDraggingChange = (dragging: boolean) => void;
export type OnTransformChange = (transform: Transform) => void;

export type PanZoomParams = {
  domNode: Element;
  minZoom: number;
  maxZoom: number;
  viewport: Viewport;
  translateExtent: CoordinateExtent;
  onTransformChange: OnTransformChange;
  onDraggingChange: OnDraggingChange;
  onPanZoomStart?: OnPanZoom;
  onPanZoom?: OnPanZoom;
  onPanZoomEnd?: OnPanZoom;
};

export type PanZoomTransformOptions = {
  duration?: number;
};

export type OnPanZoom = (event: MouseEvent | TouchEvent | null, viewport: Viewport) => void;

export type PanZoomUpdateOptions = {
  noWheelClassName: string;
  noPanClassName: string;
  onPaneContextMenu?: (event: MouseEvent) => void;
  preventScrolling: boolean;
  panOnScroll: boolean;
  panOnDrag: boolean | number[];
  panOnScrollMode: PanOnScrollMode;
  panOnScrollSpeed: number;
  userSelectionActive: boolean;
  zoomOnPinch: boolean;
  zoomOnScroll: boolean;
  zoomOnDoubleClick: boolean;
  zoomActivationKeyPressed: boolean;
  lib: string;
};

export type PanZoomInstance = {
  update: (params: PanZoomUpdateOptions) => void;
  destroy: () => void;
  getViewport: () => Viewport;
  setViewport: (viewport: Viewport, options?: PanZoomTransformOptions) => ZoomTransform | undefined;
  setViewportConstrained: (
    viewport: Viewport,
    extent: CoordinateExtent,
    translateExtent: CoordinateExtent
  ) => ZoomTransform | undefined;
  setScaleExtent: (scaleExtent: [number, number]) => void;
  setTranslateExtent: (translateExtent: CoordinateExtent) => void;
  scaleTo: (scale: number, options?: PanZoomTransformOptions) => void;
  scaleBy: (factor: number, options?: PanZoomTransformOptions) => void;
  syncViewport: (viewport: Viewport) => void;
};

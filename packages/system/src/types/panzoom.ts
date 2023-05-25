import { ZoomTransform } from 'd3-zoom';
import { CoordinateExtent, PanOnScrollMode, Transform, Viewport } from './';

export type OnDraggingChange = (dragging: boolean) => void;
export type OnTransformChange = (transform: Transform) => void;

export type InitPanZoomParams = {
  domNode: Element;
  minZoom: number;
  maxZoom: number;
  viewport: Viewport;
  translateExtent: CoordinateExtent;
  onTransformChange: OnTransformChange;
  onDraggingChange: OnDraggingChange;
};

export type PanZoomTransformOptions = {
  duration?: number;
};

export type OnPanZoom = (event: MouseEvent | TouchEvent | null, viewport: Viewport) => void;

export type PanZoomUpdateOptions = {
  noWheelClassName: string;
  noPanClassName: string;
  onPanZoomStart?: OnPanZoom;
  onPanZoom?: OnPanZoom;
  onPanZoomEnd?: OnPanZoom;
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
};

export type PanZoomInstance = {
  init: (params: InitPanZoomParams) => { transform: Transform };
  update: (params: PanZoomUpdateOptions) => void;
  setTransform: (transform: ZoomTransform, options?: PanZoomTransformOptions) => void;
  setTransformXYZ: (viewport: Viewport, options?: PanZoomTransformOptions) => ZoomTransform | undefined;
  setTransformXYZConstrained: (
    viewport: Viewport,
    extent: CoordinateExtent,
    translateExtent: CoordinateExtent
  ) => ZoomTransform | undefined;
  setScaleExtent: (scaleExtent: [number, number]) => void;
  setTranslateExtent: (translateExtent: CoordinateExtent) => void;
  scaleTo: (scale: number, options?: PanZoomTransformOptions) => void;
  scaleBy: (factor: number, options?: PanZoomTransformOptions) => void;
};

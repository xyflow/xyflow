import { ZoomTransform } from 'd3-zoom';
import {
  CoordinateExtent,
  OnMove,
  OnMoveEnd,
  OnMoveStart,
  OnViewportChange,
  PanOnScrollMode,
  Transform,
  Viewport,
} from './';

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

export type PanZoomUpdateOptions = {
  elementsSelectable?: boolean;
  noWheelClassName: string;
  noPanClassName: string;
  onMoveStart?: OnMoveStart;
  onMove?: OnMove;
  onMoveEnd?: OnMoveEnd;
  onViewportChangeStart?: OnViewportChange;
  onViewportChange?: OnViewportChange;
  onViewportChangeEnd?: OnViewportChange;
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

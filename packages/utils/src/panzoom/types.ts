import {
  D3SelectionInstance,
  D3ZoomHandler,
  D3ZoomInstance,
  OnMove,
  OnMoveEnd,
  OnMoveStart,
  OnViewportChange,
  PanOnScrollMode,
  Viewport,
  OnDraggingChange,
  OnTransformChange,
} from '@reactflow/system';

export type PanOnScrollParams = {
  noWheelClassName: string;
  d3Selection: D3SelectionInstance;
  d3Zoom: D3ZoomInstance;
  panOnScrollMode: PanOnScrollMode;
  panOnScrollSpeed: number;
  zoomOnPinch: boolean;
};

export type ZoomOnScrollParams = {
  noWheelClassName: string;
  preventScrolling: boolean;
  d3ZoomHandler: D3ZoomHandler;
};

export type ZoomPanValues = {
  isZoomingOrPanning: boolean;
  zoomedWithRightMouseButton: boolean;
  prevTransform: Viewport;
  mouseButton: number;
  timerId: ReturnType<typeof setTimeout> | undefined;
};

export type PanZoomStartParams = {
  zoomPanValues: ZoomPanValues;
  onDraggingChange: OnDraggingChange;
  onMoveStart?: OnMoveStart;
  onViewportChangeStart?: (viewport: Viewport) => void;
};

export type PanZoomParams = {
  zoomPanValues: ZoomPanValues;
  panOnDrag: boolean | number[];
  onPaneContextMenu: boolean;
  onTransformChange: OnTransformChange;
  onMove?: OnMove;
  onViewportChange?: OnViewportChange;
};

export type PanZoomEndParams = {
  zoomPanValues: ZoomPanValues;
  panOnDrag: boolean | number[];
  panOnScroll: boolean;
  onDraggingChange: (isDragging: boolean) => void;
  onMoveEnd?: OnMoveEnd;
  onViewportChangeEnd?: (viewport: Viewport) => void;
  onPaneContextMenu?: (event: any) => void;
};

export type FilterParams = {
  zoomActivationKeyPressed: boolean;
  zoomOnScroll: boolean;
  zoomOnPinch: boolean;
  panOnDrag: boolean | number[];
  panOnScroll: boolean;
  zoomOnDoubleClick: boolean;
  userSelectionActive: boolean;
  noWheelClassName: string;
  noPanClassName: string;
};

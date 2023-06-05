import type { OnMoveStart, OnMove, OnMoveEnd, PanOnScrollMode, Viewport } from '@xyflow/system';

export type ZoomProps = {
  initialViewport: Viewport;
  panOnScrollMode: PanOnScrollMode;
  onMove?: OnMove;
  onMoveStart?: OnMoveStart;
  onMoveEnd?: OnMoveEnd;
  preventScrolling: boolean;
  zoomOnScroll: boolean;
  zoomOnDoubleClick: boolean;
  zoomOnPinch: boolean;
  panOnScroll: boolean;
  panOnDrag: boolean | number[];
};

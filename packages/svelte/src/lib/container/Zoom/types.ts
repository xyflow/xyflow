import type { OnMove, OnMoveStart, OnMoveEnd, Viewport } from '@reactflow/system';

export type ZoomProps = {
  initialViewport?: Viewport;
  onMove?: OnMove;
  onMoveStart?: OnMoveStart;
  onMoveEnd?: OnMoveEnd;
};

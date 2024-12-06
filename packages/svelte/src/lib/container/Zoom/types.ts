import type { SvelteFlowStore } from '$lib/store/types';
import type { OnMoveStart, OnMove, OnMoveEnd, PanOnScrollMode, Viewport } from '@xyflow/system';
import type { Snippet } from 'svelte';

export type ZoomProps = {
  store: SvelteFlowStore;
  initialViewport?: Viewport;
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
  paneClickDistance: number;
  children: Snippet;
};

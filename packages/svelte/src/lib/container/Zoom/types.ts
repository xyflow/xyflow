import type { SvelteFlowStore } from '$lib/store/types';
import type { OnMoveStart, OnMove, OnMoveEnd, PanOnScrollMode } from '@xyflow/system';
import type { Snippet } from 'svelte';

export type ZoomProps = {
  store: SvelteFlowStore;
  panOnScrollMode: PanOnScrollMode;
  preventScrolling: boolean;
  zoomOnScroll: boolean;
  zoomOnDoubleClick: boolean;
  zoomOnPinch: boolean;
  panOnScroll: boolean;
  panOnDrag: boolean | number[];
  paneClickDistance: number;
  onmove?: OnMove;
  onmovestart?: OnMoveStart;
  onmoveend?: OnMoveEnd;
  oninit?: () => void;
  children: Snippet;
};

import type { SvelteFlowStore } from '#lib/store/types.js';
import type { Edge, Node, PaneEvents } from '#lib/types/index.js';
import type { OnMoveStart, OnMove, OnMoveEnd, PanOnScrollMode } from '@xyflow/system';
import type { Snippet } from 'svelte';

export type ZoomProps<NodeType extends Node = Node, EdgeType extends Edge = Edge> = {
  store: SvelteFlowStore<NodeType, EdgeType>;
  panOnScrollMode: PanOnScrollMode;
  panOnScrollSpeed: number;
  preventScrolling: boolean;
  zoomOnScroll: boolean;
  zoomOnDoubleClick: boolean;
  zoomOnPinch: boolean;
  panOnScroll: boolean;
  panOnDrag: boolean | number[];
  paneDragThreshold: number;
  onpanecontextmenu?: PaneEvents['onpanecontextmenu'];
  onmove?: OnMove;
  onmovestart?: OnMoveStart;
  onmoveend?: OnMoveEnd;
  oninit?: () => void;
  children: Snippet;
};

import type { Snippet } from 'svelte';
import type { Edge, Node, PaneEvents } from '$lib/types';

export type PaneProps = {
  panOnDrag?: boolean | number[];
  selectionOnDrag?: boolean;
  children: Snippet;
  nodes: Node[];
  edges: Edge[];
} & PaneEvents;

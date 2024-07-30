import type { Snippet } from 'svelte';
import type { Edge, Node, PaneEvents } from '$lib/types';
import type { Writable } from 'svelte/store';

export type PaneProps = {
  panOnDrag?: boolean | number[];
  selectionOnDrag?: boolean;
  children: Snippet;
  nodes: Writable<Node[]>;
  edges: Writable<Edge[]>;
} & PaneEvents;

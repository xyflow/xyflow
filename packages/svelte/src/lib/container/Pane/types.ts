import type { Snippet } from 'svelte';
import type { Writable } from 'svelte/store';
import type { Edge, Node, PaneEvents } from '$lib/types';

export type PaneProps = {
  panOnDrag?: boolean | number[];
  selectionOnDrag?: boolean;
  nodes: Writable<Node[]>;
  edges: Writable<Edge[]>;
  children: Snippet;
} & PaneEvents;

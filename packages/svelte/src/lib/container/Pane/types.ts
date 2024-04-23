import type { Snippet } from 'svelte';
import type { PaneEvents } from '$lib/types';

export type PaneProps = {
  panOnDrag?: boolean | number[];
  selectionOnDrag?: boolean;
  children: Snippet;
} & PaneEvents;

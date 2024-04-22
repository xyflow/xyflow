import type { Snippet } from 'svelte';

export type PaneProps = {
  panOnDrag?: boolean | number[];
  selectionOnDrag?: boolean;
  children: Snippet;
};

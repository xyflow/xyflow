import type { Snippet } from 'svelte';
import type { ClassValue, HTMLAttributes } from 'svelte/elements';

export type EdgeLabelProps = {
  x?: number;
  y?: number;
  selectEdgeOnClick?: boolean;
  transparent?: boolean;
  style?: string;
  class?: ClassValue;
  children?: Snippet;
} & HTMLAttributes<HTMLDivElement>;

import type { Dimensions, XYPosition } from '@xyflow/system';
import type { Snippet } from 'svelte';
import type { ClassValue, HTMLAttributes } from 'svelte/elements';

export type EdgeLabelProps = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  selectEdgeOnClick?: boolean;
  transparent?: boolean;
  children?: Snippet;
} & HTMLAttributes<HTMLDivElement>;

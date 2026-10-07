import type { OptionalOrUndefined } from '@xyflow/system';
import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export type EdgeLabelProps = OptionalOrUndefined<
  {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    selectEdgeOnClick?: boolean;
    transparent?: boolean;
    children?: Snippet;
  } & HTMLAttributes<HTMLDivElement>
>;

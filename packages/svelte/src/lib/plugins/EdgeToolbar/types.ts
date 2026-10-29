import type { EdgeToolbarBaseProps } from '@xyflow/system';
import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export type EdgeToolbarProps = Omit<EdgeToolbarBaseProps, 'edgeId'> & {
  selectEdgeOnClick?: boolean;
  children?: Snippet;
} & HTMLAttributes<HTMLDivElement>;

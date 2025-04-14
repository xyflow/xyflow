import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export type ViewportPortalProps = {
  children?: Snippet;
} & HTMLAttributes<HTMLDivElement>;

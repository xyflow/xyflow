import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export type ViewportPortalProps = {
  target: 'front' | 'back';
  children?: Snippet;
} & HTMLAttributes<HTMLDivElement>;

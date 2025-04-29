import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export type ViewportPortalProps = {
  moveTo: 'front' | 'back';
  children?: Snippet;
} & HTMLAttributes<HTMLDivElement>;

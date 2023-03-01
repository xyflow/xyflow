import type { Node } from '$lib/types';

export type NodeWrapperProps = Node & {
  'on:nodeclick'?: (event: MouseEvent) => void;
  resizeObserver?: ResizeObserver | null;
};

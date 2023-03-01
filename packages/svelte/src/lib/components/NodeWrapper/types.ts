import type { Node } from '$lib/types';

export type NodeWrapperProps = Node & {
  resizeObserver?: ResizeObserver | null;
};

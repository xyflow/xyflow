import type { SvelteFlowStore } from '$lib/store/types';
import type { Node } from '$lib/types';

export type ConnectableContext = {
  value: boolean;
};

export type NodeWrapperProps = {
  node: Node;
  store: SvelteFlowStore;
  nodeClickDistance?: number;
  resizeObserver?: ResizeObserver | null;
};

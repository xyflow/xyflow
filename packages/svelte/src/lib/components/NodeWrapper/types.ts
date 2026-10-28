import type { SvelteFlowStore } from '$lib/store/types.js';
import type { Node, Edge, InternalNode } from '$lib/types/index.js';

export type ConnectableContext = {
  value: boolean;
};

export type NodeWrapperProps<NodeType extends Node = Node, EdgeType extends Edge = Edge> = {
  node: InternalNode<NodeType>;
  store: SvelteFlowStore<NodeType, EdgeType>;
  nodeClickDistance?: number;
  resizeObserver?: ResizeObserver | null;
};

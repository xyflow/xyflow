import type { SvelteFlowStore } from '$lib/store/types';
import type { Node, Edge, NodeEvents, NodeSelectionEvents } from '$lib/types';

export type NodeSelectionProps<NodeType extends Node = Node, EdgeType extends Edge = Edge> = {
  store: SvelteFlowStore<NodeType, EdgeType>;
} & NodeSelectionEvents<NodeType> &
  Pick<NodeEvents<NodeType>, 'onnodedrag' | 'onnodedragstart' | 'onnodedragstop'>;

import type { SvelteFlowStore } from '$lib/store/types';
import type { Node, Edge, KeyDefinition } from '$lib/types';

export type KeyHandlerProps<NodeType extends Node = Node, EdgeType extends Edge = Edge> = {
  store: SvelteFlowStore<NodeType, EdgeType>;
  selectionKey?: KeyDefinition | KeyDefinition[] | null;
  multiSelectionKey?: KeyDefinition | KeyDefinition[] | null;
  deleteKey?: KeyDefinition | KeyDefinition[] | null;
  panActivationKey?: KeyDefinition | KeyDefinition[] | null;
  zoomActivationKey?: KeyDefinition | KeyDefinition[] | null;
};

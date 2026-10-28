import type { OptionalOrUndefined } from '@xyflow/system';
import type { SvelteFlowStore } from '$lib/store/types.js';
import type { Node, Edge, KeyDefinition } from '$lib/types/index.js';

export type KeyHandlerProps<
  NodeType extends Node = Node,
  EdgeType extends Edge = Edge
> = OptionalOrUndefined<{
  store: SvelteFlowStore<NodeType, EdgeType>;
  selectionKey?: KeyDefinition | KeyDefinition[] | null;
  multiSelectionKey?: KeyDefinition | KeyDefinition[] | null;
  deleteKey?: KeyDefinition | KeyDefinition[] | null;
  panActivationKey?: KeyDefinition | KeyDefinition[] | null;
  zoomActivationKey?: KeyDefinition | KeyDefinition[] | null;
}>;

import { getContext } from 'svelte';
import { errorMessages } from '@xyflow/system';

import type { StoreContext, SvelteFlowStore } from '../store/types';

import { key } from '../store';
import type { Node, Edge } from '$lib/types';

const providerErrorMessage = errorMessages['error001']('svelte');

export function useStore<
  NodeType extends Node = Node,
  EdgeType extends Edge = Edge
>(): SvelteFlowStore<NodeType, EdgeType> {
  const storeContext = getContext<StoreContext<NodeType, EdgeType>>(key);

  if (!storeContext) {
    throw new Error(providerErrorMessage);
  }

  return storeContext.getStore();
}

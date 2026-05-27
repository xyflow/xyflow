import { getContext } from 'svelte';
import { XYErrorCode } from '@xyflow/system';

import type { StoreContext, SvelteFlowStore } from '../store/types';

import { key } from '../store';
import type { Node, Edge } from '$lib/types';
import { toError } from '$lib/errors';

const providerError = toError(XYErrorCode.ZUSTAND_STORE_NOT_PROVIDED);

export function useStore<
  NodeType extends Node = Node,
  EdgeType extends Edge = Edge
>(): SvelteFlowStore<NodeType, EdgeType> {
  const storeContext = getContext<StoreContext<NodeType, EdgeType>>(key);

  if (!storeContext) {
    throw providerError;
  }

  return storeContext.getStore();
}

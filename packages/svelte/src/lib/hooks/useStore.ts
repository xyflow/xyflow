import { getContext } from 'svelte';
import type { StoreContext, SvelteFlowStore } from '../store/types';

import { key } from '../store';
import { derivedWarning } from './derivedWarning.svelte';
import type { Node, Edge } from '$lib/types';

export function useStore<
  NodeType extends Node = Node,
  EdgeType extends Edge = Edge
>(): SvelteFlowStore<NodeType, EdgeType> {
  const storeContext = getContext<StoreContext<NodeType, EdgeType>>(key);

  if (!storeContext) {
    throw new Error(
      'To call useStore outside of <SvelteFlow /> you need to wrap your component in a <SvelteFlowProvider />'
    );
  }

  if (process.env.NODE_ENV === 'development') {
    derivedWarning('useStore');
  }

  return storeContext.getStore();
}

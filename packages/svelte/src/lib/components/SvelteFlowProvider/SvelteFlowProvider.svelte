<script lang="ts" generics="NodeType extends Node = Node, EdgeType extends Edge = Edge">
  import { onDestroy, setContext } from 'svelte';

  import { createStore, key } from '$lib/store';
  import type { SvelteFlowProviderProps } from './types';
  import type { ProviderContext, SvelteFlowStore } from '$lib/store/types';
  import type { Node, Edge } from '$lib/types';

  let { children }: SvelteFlowProviderProps = $props();

  let store = $state.raw(
    createStore<NodeType, EdgeType>({
      props: {},
      nodes: [],
      edges: []
    })
  );

  setContext(key, {
    provider: true,
    getStore() {
      return store;
    },
    setStore: (newStore: SvelteFlowStore<NodeType, EdgeType>) => {
      store = newStore;
    }
  } satisfies ProviderContext<NodeType, EdgeType>);

  onDestroy(() => {
    store.reset();
  });
</script>

{@render children?.()}

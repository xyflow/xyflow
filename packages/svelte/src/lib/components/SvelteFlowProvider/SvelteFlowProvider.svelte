<script lang="ts" generics="NodeType extends Node = Node, EdgeType extends Edge = Edge">
  import { onDestroy, setContext } from 'svelte';

  import { createStore, key } from '#lib/store/index.js';
  import type { SvelteFlowProviderProps } from './types.js';
  import type { ProviderContext, SvelteFlowStore } from '#lib/store/types.js';
  import type { Node, Edge } from '#lib/types/index.js';

  let { children }: SvelteFlowProviderProps = $props();

  const initialStore = createStore<NodeType, EdgeType>({
    props: {},
    nodes: [],
    edges: []
  });

  let store = $state.raw(initialStore);

  setContext(key, {
    provider: true,
    getStore() {
      return store;
    },
    setStore: (newStore: SvelteFlowStore<NodeType, EdgeType> | null) => {
      store = newStore ?? initialStore;
    }
  } satisfies ProviderContext<NodeType, EdgeType>);

  onDestroy(() => {
    store.reset();
  });
</script>

{@render children?.()}

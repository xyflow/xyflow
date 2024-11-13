<script lang="ts">
  import { onDestroy, setContext } from 'svelte';

  import { createStore, key } from '$lib/store';
  import type { SvelteFlowProviderProps } from './types';

  let {
    initialNodes,
    initialEdges,
    initialWidth,
    initialHeight,
    nodeOrigin,
    fitView,
    children
  }: SvelteFlowProviderProps = $props();

  const store = createStore({
    nodes: initialNodes,
    edges: initialEdges,
    width: initialWidth,
    height: initialHeight,
    nodeOrigin,
    fitView
  });

  setContext(key, {
    getStore: () => store
  });

  onDestroy(() => {
    store.reset();
  });
</script>

{@render children?.()}

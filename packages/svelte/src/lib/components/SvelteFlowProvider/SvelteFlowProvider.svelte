<script lang="ts">
  import { onDestroy, setContext } from 'svelte';
  
  import { createStore, key } from '$lib/store';
  import type { SvelteFlowProviderProps } from './types';

  type $$Props = SvelteFlowProviderProps;

  export let nodes: $$Props['nodes'];
  export let edges: $$Props['edges'];

  const store = createStore({
    nodes,
    edges,
  });

  setContext(key, {
    getStore: () => store
  });

  onDestroy(() => {
    store.reset();
  });
</script>

<slot />

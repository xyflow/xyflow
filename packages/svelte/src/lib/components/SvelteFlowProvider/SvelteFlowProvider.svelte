<script lang="ts">
  import { onDestroy, setContext } from 'svelte';

  import { createStore, key } from '$lib/store';
  import type { SvelteFlowProviderProps } from './types';

  type $$Props = SvelteFlowProviderProps;

  export let initialNodes: $$Props['initialNodes'] = undefined;
  export let initialEdges: $$Props['initialEdges'] = undefined;
  export let initialWidth: $$Props['initialWidth'] = undefined;
  export let initialHeight: $$Props['initialHeight'] = undefined;
  export let fitView: $$Props['fitView'] = undefined;

  const store = createStore({
    nodes: initialNodes,
    edges: initialEdges,
    width: initialWidth,
    height: initialHeight,
    fitView
  });

  setContext(key, {
    getStore: () => store
  });

  onDestroy(() => {
    store.reset();
  });
</script>

<slot />

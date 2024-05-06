<script lang="ts">
  import { onDestroy } from 'svelte';

  import { createStoreContext } from '$lib/store';
  import type { SvelteFlowProviderProps } from './types';

  let { children }: SvelteFlowProviderProps = $props();

  const store = createStoreContext();

  onDestroy(() => {
    store.reset();
  });
</script>

{#if children}
  {@render children()}
{/if}

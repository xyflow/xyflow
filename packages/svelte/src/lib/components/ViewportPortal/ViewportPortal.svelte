<script lang="ts">
  import portal from '$lib/actions/portal';
  import { useStore } from '$lib/store';
  import type { Snippet } from 'svelte';

  let { children }: { children?: Snippet } = $props();

  const store = useStore();
</script>

<div use:portal={{ target: '.svelte-flow__viewport-portal', domNode: store.domNode }}>
  {#if children}
    {@render children()}
  {/if}
</div>

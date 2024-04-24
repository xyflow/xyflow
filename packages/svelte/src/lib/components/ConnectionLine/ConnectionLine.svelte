<script lang="ts">
  import cc from 'classcat';
  import { useStore } from '$lib/store';
  import type { Snippet } from 'svelte';

  let {
    containerStyle = '',
    style = '',
    connectionLine
  }: {
    containerStyle: string;
    style: string;
    connectionLine?: Snippet;
  } = $props();

  const store = useStore();
</script>

{#if store.connection.path}
  <svg
    width={store.width}
    height={store.height}
    class="svelte-flow__connectionline"
    style={containerStyle}
  >
    <g class={cc(['svelte-flow__connection', store.connection.status])}>
      {#if connectionLine}
        {@render connectionLine()}
      {:else}
        <path d={store.connection.path} {style} fill="none" class="svelte-flow__connection-path" />
      {/if}
    </g>
  </svg>
{/if}

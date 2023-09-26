<script lang="ts">
  import { EdgeWrapper } from '$lib/components/EdgeWrapper';
  import { MarkerDefinition } from '$lib/container/EdgeRenderer/MarkerDefinition';
  import { useStore } from '$lib/store';
  import type { DefaultEdgeOptions } from '$lib/types';
  import { onMount } from 'svelte';

  export let defaultOptions: DefaultEdgeOptions | undefined;

  const {
    width,
    height,
    elementsSelectable,
    edgeTree,
    edges: { setDefaultOptions }
  } = useStore();

  onMount(() => {
    if (defaultOptions) setDefaultOptions(defaultOptions);
  });
</script>

{#each $edgeTree as group (group.level)}
  <svg width={$width} height={$height} style="z-index: {group.level}" class="svelte-flow__edges">
    {#if group.isMaxLevel} <MarkerDefinition />{/if}
    <g>
      {#each group.edges as edge (edge.id)}
        {@const edgeType = edge.type || 'default'}
        {@const selectable = !!(
          edge.selectable ||
          ($elementsSelectable && typeof edge.selectable === 'undefined')
        )}
        <EdgeWrapper {...edge} type={edgeType} {selectable} on:edgeclick />
      {/each}
    </g>
  </svg>
{/each}

<style>
  .svelte-flow__edges {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
</style>

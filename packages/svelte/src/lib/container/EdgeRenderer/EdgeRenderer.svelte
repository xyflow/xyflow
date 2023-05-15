<script lang="ts">
  import { EdgeWrapper } from '$lib/components/EdgeWrapper';
  import { MarkerDefinition } from '$lib/container/EdgeRenderer/MarkerDefinition';
  import { useStore } from '$lib/store';

  const { edgesLayouted, width, height } = useStore();
</script>

<svg width={$width} height={$height} class="svelte-flow__edges">
  {#each $edgesLayouted as edge (edge.id)}
    <EdgeWrapper {...edge} on:edge:click />
  {/each}

  <MarkerDefinition />
</svg>


<style>
  .svelte-flow__edges {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
    overflow: visible;
  }
</style>

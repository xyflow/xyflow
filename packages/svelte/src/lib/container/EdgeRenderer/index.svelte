<script lang="ts"> 
  import EdgeWrapper from '$lib/components/edges/EdgeWrapper.svelte';
  import { useStore } from '$lib/store';

  const { edgesWithDataStore, widthStore, heightStore } = useStore();
 </script>

<svg
  width={$widthStore}
  height={$heightStore}
  class="react-flow__edges"
>
  {#each $edgesWithDataStore as edge (edge.id)}
    <EdgeWrapper {...edge} />
  {/each}
</svg>

<style>
  .react-flow__edges {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
    overflow: visible;
  }
</style>
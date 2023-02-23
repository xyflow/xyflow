<script lang="ts"> 
  import Edge from '$lib/components/edges/BaseEdge.svelte';
  import { useStore } from '$lib/store';

  const { edgesWithDataStore, widthStore, heightStore } = useStore();
 </script>

<svg
  width={$widthStore}
  height={$heightStore}
  class="react-flow__edges react-flow__container"
>
  {#each $edgesWithDataStore as edge (edge.id)}
    <Edge {...edge} />
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
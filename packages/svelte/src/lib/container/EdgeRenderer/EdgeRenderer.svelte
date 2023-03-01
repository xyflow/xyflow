<script lang="ts">
  import { EdgeWrapper } from '$lib/components/EdgeWrapper';
  import { useStore } from '$lib/store';

  const { edgesLayouted, width, height } = useStore();
</script>

<svg width={$width} height={$height} class="react-flow__edges">
  {#each $edgesLayouted as edge (edge.id)}
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

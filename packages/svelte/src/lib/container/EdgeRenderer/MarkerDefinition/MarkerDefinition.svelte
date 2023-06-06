<script lang="ts">
  import { useStore } from '$lib/store';
  import { Marker } from '$lib/container/EdgeRenderer/MarkerDefinition';

  const { markers } = useStore();
</script>

<defs>
  {#each $markers as marker (marker.id)}
    <Marker {...marker} />
  {/each}
</defs>

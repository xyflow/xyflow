<script lang="ts">
  import { useStore } from '$lib/store/index.js';
  import { Marker } from '$lib/container/EdgeRenderer/MarkerDefinition/index.js';

  const store = useStore();
</script>

<defs>
  {#each store.markers as marker (marker.id)}
    <Marker {...marker} />
  {/each}
</defs>

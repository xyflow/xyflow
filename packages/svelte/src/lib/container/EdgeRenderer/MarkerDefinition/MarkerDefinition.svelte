<script lang="ts">
  import { useStore } from '$lib/store';
  import { Marker } from '$lib/container/EdgeRenderer/MarkerDefinition';

  const { markers } = useStore();
</script>

<defs>
  {#each $markers as marker(marker.id)}
    <Marker
      id={marker.id}
      type={marker.type}
      color={marker.color}
      width={marker.width}
      height={marker.height}
      markerUnits={marker.markerUnits}
      strokeWidth={marker.strokeWidth}
      orient={marker.orient}
    />
  {/each}
</defs>
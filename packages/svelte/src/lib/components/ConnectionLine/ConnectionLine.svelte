<script lang="ts">
  import cc from 'classcat';

  import { useStore } from '$lib/store';

  const { connectionPath, width, height, connection } = useStore();
</script>

{#if $connectionPath}
  <svg width={$width} height={$height} class="svelte-flow__connectionline">
    <g class={cc(['svelte-flow__connection', $connection.connectionStatus])}>
      <path d={$connectionPath} fill="none" class="svelte-flow__connection-path" />
    </g>
  </svg>
{/if}

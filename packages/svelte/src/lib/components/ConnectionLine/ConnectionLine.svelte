<script lang="ts">
  import cc from 'classcat';

  import { useStore } from '$lib/store';

  const { connectionPath, width, height, connection } = useStore();
</script>

{#if $connectionPath}
  <svg width={$width} height={$height} class="svelte-flow__connectionline">
    <g class={cc(['svelte-flow__connection', $connection.status])}>
      <path d={$connectionPath} fill="none" class="svelte-flow__connection-path" />
    </g>
  </svg>
{/if}

<style>
  .svelte-flow__connectionline {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    overflow: visible;
    z-index: 1001;
  }

  .svelte-flow__connection {
    pointer-events: none;
  }

  .svelte-flow__edge-path,
  .svelte-flow__connection-path {
    stroke: #b1b1b7;
    stroke-width: 1;
    fill: none;
  }
</style>
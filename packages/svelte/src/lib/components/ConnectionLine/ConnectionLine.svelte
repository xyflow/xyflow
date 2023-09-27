<script lang="ts">
  import cc from 'classcat';

  import { useStore } from '$lib/store';

  export let containerStyle: string = '';
  export let style: string = '';
  export let usingCustomLine: boolean = false;

  const { width, height, connection } = useStore();
</script>

{#if $connection.path}
  <svg width={$width} height={$height} class="svelte-flow__connectionline" style={containerStyle}>
    <slot name="connectionLine" />
    {#if !usingCustomLine}
      <g class={cc(['svelte-flow__connection', $connection.status])} {style}>
        <path d={$connection.path} fill="none" class="svelte-flow__connection-path" />
      </g>
    {/if}
  </svg>
{/if}

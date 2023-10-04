<script lang="ts">
  import cc from 'classcat';

  import { useStore } from '$lib/store';

  export let containerStyle: string = '';
  export let style: string = '';
  export let isCustomComponent: boolean = false;

  const { width, height, connection } = useStore();
</script>

{#if $connection.path}
  <svg width={$width} height={$height} class="svelte-flow__connectionline" style={containerStyle}>
    <g class={cc(['svelte-flow__connection', $connection.status])}>
      <slot name="connectionLine" />
      <!-- slot fallbacks do not work if slots are forwarded in parent -->
      {#if !isCustomComponent}
        <path d={$connection.path} {style} fill="none" class="svelte-flow__connection-path" />
      {/if}
    </g>
  </svg>
{/if}

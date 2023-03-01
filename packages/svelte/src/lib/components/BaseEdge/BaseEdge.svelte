<script lang="ts">
  import EdgeLabelRenderer from '$lib/components/EdgeLabelRenderer/EdgeLabelRenderer.svelte';
  import type { BaseEdgeProps } from './types';

  type $$Props = BaseEdgeProps;

  export let path: $$Props['path'] = '';
  export let label: $$Props['label'] = undefined;
  export let labelX: $$Props['labelX'] = undefined;
  export let labelY: $$Props['labelY'] = undefined;
  export let interactionWidth: $$Props['interactionWidth'] = 20;
</script>

<path d={path} fill="none" class="svelte-flow__edge-path" />

{#if interactionWidth}
  <path
    d={path}
    fill="none"
    stroke-opacity={0}
    stroke-width={interactionWidth}
    class="svelte-flow__edge-interaction"
  />
{/if}

{#if label}
  <EdgeLabelRenderer>
    <div
      class="svelte-flow__edge-label"
      style:transform={`translate(-50%, -50%) translate(${labelX}px,${labelY}px)`}
    >
      {label}
    </div>
  </EdgeLabelRenderer>
{/if}

<style>
  .svelte-flow__edge-label {
    position: absolute;
    background: white;
  }
</style>

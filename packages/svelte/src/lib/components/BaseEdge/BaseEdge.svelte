<script lang="ts">
  import { EdgeLabelRenderer } from '$lib/components/EdgeLabelRenderer';
  import type { BaseEdgeProps } from './types';

  type $$Props = BaseEdgeProps;

  export let id: $$Props['id'] = undefined;
  export let path: $$Props['path'] = '';
  export let label: $$Props['label'] = undefined;
  export let labelX: $$Props['labelX'] = undefined;
  export let labelY: $$Props['labelY'] = undefined;
  export let labelStyle: $$Props['labelStyle'] = undefined;
  export let markerStart: $$Props['markerStart'] = undefined;
  export let markerEnd: $$Props['markerEnd'] = undefined;
  export let style: $$Props['style'] = undefined;
  export let interactionWidth: $$Props['interactionWidth'] = 20;
</script>

<path
  d={path}
  id={id}
  fill="none"
  class="svelte-flow__edge-path"
  marker-start={markerStart}
  marker-end={markerEnd}
  style={style}
/>

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
      style={labelStyle}
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

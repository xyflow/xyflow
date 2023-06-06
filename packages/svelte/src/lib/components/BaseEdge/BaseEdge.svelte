<script lang="ts">
  import { EdgeLabelRenderer } from '$lib/components/EdgeLabelRenderer';
  import type { BaseEdgeProps } from './types';

  type $$Props = BaseEdgeProps;

  export let id: $$Props['id'] = undefined;
  export let path: $$Props['path'];
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
  {id}
  class="svelte-flow__edge-path"
  marker-start={markerStart}
  marker-end={markerEnd}
  fill="none"
  {style}
/>

{#if interactionWidth}
  <path
    d={path}
    stroke-opacity={0}
    stroke-width={interactionWidth}
    fill="none"
    class="svelte-flow__edge-interaction"
  />
{/if}

{#if label}
  <EdgeLabelRenderer>
    <div
      class="svelte-flow__edge-label"
      style:transform="translate(-50%, -50%) translate({labelX}px,{labelY}px)"
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

  .svelte-flow__edge-path {
    stroke: var(--edge-color);
    stroke-width: 1;
  }

  :global(.selected) .svelte-flow__edge-path {
    stroke: var(--edge-color-selected);
  }

  :global(.animated) .svelte-flow__edge-path {
    stroke-dasharray: 5;
    animation: dashdraw 0.5s linear infinite;
  }

  @keyframes dashdraw {
    from {
      stroke-dashoffset: 10;
    }
  }
</style>

<script lang="ts">
  import cc from 'classcat';
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
  let className: $$Props['class'] = undefined;
  export { className as class };

  // @todo, why is interactionWidth undefined after first re-render?
  let interactionWidthValue = interactionWidth === undefined ? 20 : interactionWidth;
</script>

<path
  d={path}
  {id}
  class={cc(['svelte-flow__edge-path', className])}
  marker-start={markerStart}
  marker-end={markerEnd}
  fill="none"
  {style}
/>

{#if interactionWidthValue}
  <path
    d={path}
    stroke-opacity={0}
    stroke-width={interactionWidthValue}
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

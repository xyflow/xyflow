<script lang="ts">
  import cc from 'classcat';
  import type { BaseEdgeProps } from './types';
  import EdgeLabel from '../EdgeLabel/EdgeLabel.svelte';

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

  let interactionWidthValue = interactionWidth === undefined ? 20 : interactionWidth;
</script>

<path
  {id}
  d={path}
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
  <EdgeLabel x={labelX} y={labelY} style={labelStyle}>
    {label}
  </EdgeLabel>
{/if}

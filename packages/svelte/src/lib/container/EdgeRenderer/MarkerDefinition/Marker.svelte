<script lang="ts">
  import { type MarkerProps, MarkerType } from '@xyflow/system';

  let {
    id,
    type,
    width = 12.5,
    height = 12.5,
    markerUnits = 'strokeWidth',
    orient = 'auto-start-reverse',
    color = 'none',
    strokeWidth
  }: MarkerProps = $props();
</script>

<marker
  class="svelte-flow__arrowhead"
  {id}
  markerWidth={`${width}`}
  markerHeight={`${height}`}
  viewBox="-10 -10 20 20"
  {markerUnits}
  {orient}
  refX="0"
  refY="0"
>
  {#if type === MarkerType.Arrow}
    <polyline
      class="arrow"
      style:stroke={color}
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width={strokeWidth}
      points="-5,-4 0,0 -5,4"
    />
  {:else if type === MarkerType.ArrowClosed}
    <polyline
      class="arrowclosed"
      style:stroke={color}
      style:fill={color}
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width={strokeWidth}
      points="-5,-4 0,0 -5,4 -5,-4"
    />
  {/if}
</marker>

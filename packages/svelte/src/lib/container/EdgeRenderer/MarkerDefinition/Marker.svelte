<script lang="ts">
  import { type MarkerProps, MarkerType } from '@xyflow/system';

  type $$Props = MarkerProps;

  export let id: $$Props['id'];
  export let type: $$Props['type'];
  export let width: $$Props['width'] = 12.5;
  export let height: $$Props['height'] = 12.5;
  export let markerUnits: $$Props['markerUnits'] = 'strokeWidth';
  export let orient: $$Props['orient'] = 'auto-start-reverse';
  export let color: $$Props['color'] = undefined;
  export let strokeWidth: $$Props['strokeWidth'] = undefined;
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
      stroke={color}
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width={strokeWidth}
      fill="none"
      points="-5,-4 0,0 -5,4"
    />
  {:else if type === MarkerType.ArrowClosed}
    <polyline
      stroke={color}
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width={strokeWidth}
      fill={color}
      points="-5,-4 0,0 -5,4 -5,-4"
    />
  {/if}
</marker>

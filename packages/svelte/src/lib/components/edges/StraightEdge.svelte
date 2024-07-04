<script lang="ts">
  import { getStraightPath } from '@xyflow/system';

  import type { StraightEdgeProps } from '$lib/types';
  import { BaseEdge } from '$lib/components/BaseEdge';

  type $$Props = StraightEdgeProps;

  export let id: $$Props['id'] = undefined;
  export let label: $$Props['label'] = undefined;
  export let labelStyle: $$Props['labelStyle'] = undefined;
  export let style: $$Props['style'] = undefined;
  export let markerStart: $$Props['markerStart'] = undefined;
  export let markerEnd: $$Props['markerEnd'] = undefined;
  export let interactionWidth: $$Props['interactionWidth'] = undefined;

  export let sourceX: $$Props['sourceX'];
  export let sourceY: $$Props['sourceY'];

  export let targetX: $$Props['targetX'];
  export let targetY: $$Props['targetY'];

  $: [path, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY
  });
</script>

<BaseEdge
  {id}
  {path}
  {labelX}
  {labelY}
  {label}
  {labelStyle}
  {markerStart}
  {markerEnd}
  {interactionWidth}
  {style}
/>

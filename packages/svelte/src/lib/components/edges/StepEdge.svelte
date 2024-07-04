<script lang="ts">
  import { getSmoothStepPath } from '@xyflow/system';

  import type { StepEdgeProps } from '$lib/types';
  import { BaseEdge } from '$lib/components/BaseEdge';

  type $$Props = StepEdgeProps;

  export let id: $$Props['id'] = undefined;
  export let label: $$Props['label'] = undefined;
  export let labelStyle: $$Props['labelStyle'] = undefined;
  export let style: $$Props['style'] = undefined;
  export let markerStart: $$Props['markerStart'] = undefined;
  export let markerEnd: $$Props['markerEnd'] = undefined;
  export let pathOptions: $$Props['pathOptions'] = undefined;
  export let interactionWidth: $$Props['interactionWidth'] = undefined;

  export let sourceX: $$Props['sourceX'];
  export let sourceY: $$Props['sourceY'];
  export let sourcePosition: $$Props['sourcePosition'];

  export let targetX: $$Props['targetX'];
  export let targetY: $$Props['targetY'];
  export let targetPosition: $$Props['targetPosition'];

  $: [path, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 0,
    offset: pathOptions?.offset
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

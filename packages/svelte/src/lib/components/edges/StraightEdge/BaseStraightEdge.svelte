<script lang="ts">
  import { getStraightPath } from '@xyflow/system';

  import type { SmoothStepEdgeProps } from '$lib/types';
  import { BaseEdge } from '$lib/components/BaseEdge';

  type $$Props = SmoothStepEdgeProps & { internal?: boolean };

  $: [path, labelX, labelY] = getStraightPath({
    sourceX: $$props.sourceX,
    sourceY: $$props.sourceY,
    targetX: $$props.targetX,
    targetY: $$props.targetY
  });

  $: id = $$props.internal ? undefined : $$props.id;
</script>

<BaseEdge
  {path}
  {labelX}
  {labelY}
  {id}
  label={$$props.label}
  labelStyle={$$props.labelStyle}
  markerStart={$$props.markerStart}
  markerEnd={$$props.markerEnd}
  interactionWidth={$$props.interactionWidth}
  style={$$props.style}
/>

<script lang="ts">
  import { getSmoothStepPath } from '@xyflow/system';

  import type { EdgeProps } from '$lib/types';
  import { BaseEdge } from '$lib/components/BaseEdge';

  type $$Props = Partial<EdgeProps>;

  $: [path, labelX, labelY] = getSmoothStepPath({
    sourceX: $$props.sourceX,
    sourceY: $$props.sourceY,
    targetX: $$props.targetX,
    targetY: $$props.targetY,
    sourcePosition: $$props.sourcePosition,
    targetPosition: $$props.targetPosition,
    borderRadius: 0
  });
</script>

<BaseEdge
  {path}
  {labelX}
  {labelY}
  id={$$props.id}
  label={$$props.label}
  labelStyle={$$props.labelStyle}
  markerStart={$$props.markerStart}
  markerEnd={$$props.markerEnd}
  interactionWidth={$$props.interactionWidth}
  style={$$props.style}
/>

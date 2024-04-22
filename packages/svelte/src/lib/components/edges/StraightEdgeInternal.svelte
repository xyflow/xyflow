<script lang="ts">
  import { getStraightPath } from '@xyflow/system';

  import type { EdgeProps } from '$lib/types';
  import { BaseEdge } from '$lib/components/BaseEdge';

  let {
    sourceX,
    sourceY,
    targetX,
    targetY,
    label,
    labelStyle,
    markerStart,
    markerEnd,
    interactionWidth,
    style
  }: EdgeProps = $props();

  let [path, labelX, labelY] = $derived(
    getStraightPath({
      sourceX,
      sourceY,
      targetX,
      targetY
    })
  );
</script>

<BaseEdge
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

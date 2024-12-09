<script lang="ts">
  import { getStraightPath } from '@xyflow/system';

  import type { StraightEdgeProps } from '$lib/types';
  import { BaseEdge } from '$lib/components/BaseEdge';

  let {
    id,
    label,
    labelStyle,
    style,
    markerStart,
    markerEnd,
    interactionWidth,
    sourceX,
    sourceY,
    targetX,
    targetY
  }: StraightEdgeProps = $props();

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

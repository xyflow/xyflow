<script lang="ts">
  import { getBezierPath } from '@xyflow/system';

  import type { BezierEdgeProps } from '$lib/types';

  import { BaseEdge } from '$lib/components/BaseEdge';

  let {
    id,
    label,
    labelStyle,
    style,
    markerStart,
    markerEnd,
    pathOptions,
    interactionWidth,
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition
  }: BezierEdgeProps = $props();

  let [path, labelX, labelY] = $derived(
    getBezierPath({
      sourceX,
      sourceY,
      targetX,
      targetY,
      sourcePosition,
      targetPosition,
      curvature: pathOptions?.curvature
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
